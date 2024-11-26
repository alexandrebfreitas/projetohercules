import React from "react";

function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Título da página */}
        <div className="col-12 my-4">
          <h1 className="display-6">Dashboard</h1>
          <p className="text-muted">Bem-vindo ao painel de controle.</p>
        </div>
      </div>

      {/* Cards com estatísticas */}
      <div className="row">
        <div className="col-md-4 col-sm-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Usuários Ativos</h5>
              <p className="card-text display-6">128</p>
              <a href="/users" className="btn btn-outline-primary btn-sm">
                Ver Detalhes
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Vendas</h5>
              <p className="card-text display-6">$45,000</p>
              <a href="/sales" className="btn btn-outline-success btn-sm">
                Ver Relatório
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pedidos Pendentes</h5>
              <p className="card-text display-6">27</p>
              <a href="/orders" className="btn btn-outline-warning btn-sm">
                Gerenciar Pedidos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico (placeholder) */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Resumo de Vendas</h5>
              <p className="text-muted">Gráfico mostrando as vendas por período.</p>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: "300px",
                  background: "#f8f9fa",
                  border: "1px dashed #ccc",
                }}
              >
                <span className="text-muted">[Placeholder do Gráfico]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
