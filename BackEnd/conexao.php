<?php
// Configurações do banco de dados
$servidor = "localhost"; // ou o IP do servidor de banco de dados
$usuario = "root";
$senha = "";
$banco = "dogvideo";

// Criar a conexão
$conexao = new mysqli($servidor, $usuario, $senha, $banco);

// Verificar a conexão
if ($conexao->connect_error) {
    die("Falha na conexão: " . $conexao->connect_error);
}
echo "Conectado com sucesso!";
