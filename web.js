const express = require('express');
const { Client } = require('ssh2');
const app = express();

const sshConfig = {
  host: 'remote-server-ip', 
  port: 22, 
  username: 'user', 
  privateKey: require('fs').readFileSync('/path/to/your/private/key') // Ruta a tu clave privada
};

app.post('/deploy', (req, res) => {
  const conn = new Client();

  conn.on('ready', () => {
    console.log('Conexión SSH establecida');
    
    conn.exec('bash /path/to/deploy.sh', (err, stream) => {
      if (err) {
        console.error('Error ejecutando el script:', err);
        res.status(500).json({ message: 'Error ejecutando el script' });
        conn.end();
        return;
      }

      stream.on('close', (code, signal) => {
        console.log('Script de despliegue finalizado con código', code);
        res.json({ message: 'Despliegue completado', code });
        conn.end();
      }).on('data', (data) => {
        console.log('STDOUT:', data.toString());
      }).stderr.on('data', (data) => {
        console.error('STDERR:', data.toString());
      });
    });
  }).connect(sshConfig);
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
