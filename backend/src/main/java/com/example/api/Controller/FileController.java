package com.example.api.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@Controller
@RequestMapping("/file")
public class FileController {
    // Endpoint para upload de arquivos
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
                                             @RequestParam(value = "path", defaultValue = "") String path) {
        try {
            Path uploadDirectory = Paths.get("uploads").resolve(path).normalize();
            Files.createDirectories(uploadDirectory);
            Path copyLocation = uploadDirectory.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), copyLocation, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload file: " + file.getOriginalFilename() + ". Error: " + e.getMessage());
        }
    }
    @PostMapping("/unzip")
    public ResponseEntity<String> unzipFile(@RequestParam("path") String path) {
        System.out.println("Path received for unzipping: " + path); // Log para ver o caminho recebido
        try {
            Path zipFilePath = Paths.get("uploads").resolve(path).normalize();

            // Verifica se o arquivo ZIP existe
            if (!Files.exists(zipFilePath) || !zipFilePath.toString().endsWith(".zip")) {
                return ResponseEntity.status(404).body("ZIP file not found: " + path);
            }

            // Define o diretório de extração
            Path extractDir = zipFilePath.getParent().resolve(zipFilePath.getFileName().toString().replace(".zip", ""));
            Files.createDirectories(extractDir);

            // Extrai o conteúdo do ZIP
            try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFilePath.toFile()))) {
                ZipEntry zipEntry;
                while ((zipEntry = zis.getNextEntry()) != null) {
                    Path newFilePath = extractDir.resolve(zipEntry.getName()).normalize();
                    if (zipEntry.isDirectory()) {
                        Files.createDirectories(newFilePath);
                    } else {
                        Files.createDirectories(newFilePath.getParent());
                        Files.copy(zis, newFilePath, StandardCopyOption.REPLACE_EXISTING);
                    }
                    zis.closeEntry();
                }
            }

            return ResponseEntity.ok("File unzipped successfully: " + zipFilePath.getFileName());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not unzip file: " + e.getMessage());
        }
    }
    @PostMapping("/save")
    public ResponseEntity<String> saveFile(@RequestParam("path") String path,
                                           @RequestParam("content") String content) {
        try {
            Path filePath = Paths.get("uploads").resolve(path).normalize();

            // Valide se o arquivo realmente existe
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(404).body("File not found: " + path);
            }

            // Gravar o conteúdo no arquivo
            Files.write(filePath, content.getBytes(), StandardOpenOption.TRUNCATE_EXISTING);
            return ResponseEntity.ok("File saved successfully: " + path);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not save file: " + e.getMessage());
        }
    }

    // Endpoint para download de arquivos
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("path") String path) {
        try {
            Path filePath = Paths.get("uploads").resolve(path).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(404).body(null);
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Endpoint para listar arquivos e pastas em um diretório específico
    @GetMapping("/list")
    public ResponseEntity<List<String>> listFiles(@RequestParam(value = "path", defaultValue = "") String path) {
        try {
            Path baseDir = Paths.get("uploads").resolve(path).normalize(); // Resolve o caminho relativo dentro de uploads
            if (!Files.exists(baseDir)) {
                return ResponseEntity.status(404).body(List.of("Directory not found"));
            }

            List<String> fileNames = Files.list(baseDir)
                    .map(p -> p.getFileName().toString() + (Files.isDirectory(p) ? "/" : "")) // Adiciona '/' ao final das pastas
                    .collect(Collectors.toList());

            return ResponseEntity.ok(fileNames);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(List.of("Error: " + e.getMessage()));
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam("path") String path) {
        try {
            Path filePath = Paths.get("uploads").resolve(path).normalize();
            if (Files.exists(filePath)) {
                Files.walk(filePath)
                        .sorted((a, b) -> b.compareTo(a)) // Primeiro os arquivos mais internos
                        .forEach(p -> {
                            try {
                                Files.delete(p);
                            } catch (IOException e) {
                                throw new RuntimeException("Failed to delete " + p, e);
                            }
                        });
                return ResponseEntity.ok("File or directory deleted successfully: " + filePath);
            } else {
                return ResponseEntity.status(404).body("File not found: " + path);
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not delete file: " + e.getMessage());
        }
    }


    @GetMapping("/zip-folder")
    public ResponseEntity<Resource> zipFolder(@RequestParam("path") String path) {
        try {
            Path folderPath = Paths.get("uploads").resolve(path).normalize();
            if (!Files.exists(folderPath) || !Files.isDirectory(folderPath)) {
                return ResponseEntity.status(404).body(null);
            }

            // Criar arquivo ZIP
            Path zipFilePath = Paths.get("uploads", path + ".zip");
            try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipFilePath.toFile()))) {
                Files.walk(folderPath).forEach(file -> {
                    try {
                        String zipEntryName = folderPath.relativize(file).toString();
                        zipOut.putNextEntry(new ZipEntry(zipEntryName));
                        if (!Files.isDirectory(file)) {
                            Files.copy(file, zipOut);
                        }
                        zipOut.closeEntry();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }

            // Baixar o arquivo ZIP criado
            Resource resource = new UrlResource(zipFilePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(404).body(null);
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    // Endpoint para criar uma nova pasta
    @PostMapping("/create-folder")
    public ResponseEntity<String> createFolder(@RequestParam("folderName") String folderName,
                                               @RequestParam(value = "path", defaultValue = "") String path) {
        try {
            Path folderPath = Paths.get("uploads").resolve(path).resolve(folderName).normalize();
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
                return ResponseEntity.ok("Folder created successfully: " + folderName);
            } else {
                return ResponseEntity.status(400).body("Folder already exists: " + folderName);
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not create folder: " + folderName + ". Error: " + e.getMessage());
        }
    }
    @RequestMapping(value = "/move", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<Map<String, String>> moveFile(@RequestBody Map<String, String> payload) {
        String fileName = payload.get("fileName");
        String from = payload.get("from");
        String to = payload.get("to");

        Map<String, String> response = new HashMap<>();

        if (fileName == null || from == null || to == null) {
            response.put("status", "error");
            response.put("message", "Missing required parameters.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Path sourcePath = Paths.get("uploads").resolve(from).resolve(fileName).normalize();
            Path targetPath = Paths.get("uploads").resolve(to).resolve(fileName).normalize();

            if (!Files.exists(sourcePath)) {
                response.put("status", "error");
                response.put("message", "Source file not found: " + sourcePath);
                return ResponseEntity.status(404).body(response);
            }

            Files.createDirectories(targetPath.getParent());
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);

            response.put("status", "success");
            response.put("message", "File moved successfully from " + from + " to " + to);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "Could not move file: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

}
