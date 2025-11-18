-- Criação do Banco de Dados
CREATE DATABASE SafraGo;

-- Seleção do Banco de Dados
USE SafraGo;

-- Tabela de Comprador (FK do Firebase UID)
-- fk_usuario (VARCHAR) é a chave primária (PK) e armazena o UID do Firebase.
CREATE TABLE comprador (
    fk_usuario VARCHAR(128) NOT NULL, 
    endereco VARCHAR(150) NOT NULL,
    PRIMARY KEY (fk_usuario)
) ENGINE=InnoDB;

-- Tabela de Produtor (FK do Firebase UID)
-- fk_usuario (VARCHAR) é a chave primária (PK) e armazena o UID do Firebase.
CREATE TABLE produtor (
    fk_usuario VARCHAR(128) NOT NULL, 
    nome_fazenda VARCHAR(50) NOT NULL,
    endereco VARCHAR(150) NOT NULL,
    descricao TEXT,
    PRIMARY KEY (fk_usuario)
) ENGINE=InnoDB;

-- Tabela de Produtos
-- fk_usuario (VARCHAR) armazena o UID do Produtor/Vendedor.
CREATE TABLE produto (
    id_produto INTEGER NOT NULL AUTO_INCREMENT,
    nome_produto VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    data_publicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_usuario VARCHAR(128) NOT NULL, -- UID do Produtor
    PRIMARY KEY (id_produto)
    -- NOTA: Sem Chave Estrangeira (FOREIGN KEY) para usuário, pois o Firebase gerencia a autenticação.
) ENGINE=InnoDB;

-- Tabela de Favoritos
-- fk_usuario (VARCHAR) armazena o UID do usuário que favoritou.
CREATE TABLE favorito (
    id_favorito INTEGER NOT NULL AUTO_INCREMENT,
    data_favorito DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_usuario VARCHAR(128) NOT NULL, -- UID de quem favoritou
    fk_produto INTEGER NOT NULL,
    PRIMARY KEY(id_favorito),
    -- Mantemos a FK para a tabela produto, que ainda é gerenciada pelo MySQL
    FOREIGN KEY(fk_produto) REFERENCES produto (id_produto),
    -- Garante que um UID (usuário) só pode favoritar o mesmo produto uma vez
    UNIQUE KEY (fk_usuario, fk_produto) 
) ENGINE=InnoDB;

-- Tabela de Mensagens

CREATE TABLE mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversa_id INT NOT NULL,
    remetente_uid VARCHAR(128) NOT NULL,
    destinatario_uid VARCHAR(128) NOT NULL,
    mensagem TEXT,
    imagem VARCHAR(255),
    enviada_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    lida TINYINT(1) DEFAULT 0
);

CREATE TABLE conversas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comprador_uid VARCHAR(128) NOT NULL, 
    vendedor_uid VARCHAR(128) NOT NULL,
    produto_id INT NOT NULL,
    ultima_msg TEXT,
    atualizada_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_online (
    user_uid VARCHAR(128) PRIMARY KEY,
    ultimo_ping DATETIME NOT NULL
);

