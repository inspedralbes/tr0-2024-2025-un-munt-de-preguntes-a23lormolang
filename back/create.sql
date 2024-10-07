DROP DATABASE IF EXISTS jocPreguntes;
CREATE DATABASE jocPreguntes;
USE jocPreguntes;

DROP TABLE IF EXISTS preguntes;

CREATE TABLE IF NOT EXISTS preguntes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pregunta TEXT NOT NULL,
        imatge VARCHAR(255) DEFAULT NULL
    );

DROP TABLE IF EXISTS respostes;

CREATE TABLE IF NOT EXISTS respostes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pregunta_id INT NOT NULL,
        resposta VARCHAR(255) NOT NULL,
        correcta TINYINT(1) NOT NULL,
        FOREIGN KEY (pregunta_id) REFERENCES preguntes(id) ON DELETE CASCADE
    );