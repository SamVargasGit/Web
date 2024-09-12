const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Conexión SSH establecida');
  conn.exec('bash /path/to/deploy.sh', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Script de despliegue finalizado con código ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('STDERR: ' + data);
    });
  });
}).connect({
  host: 'remote-server-ip',
  port: 22,
  username: 'user',
  privateKey: require('fs').readFileSync('/path/to/your/private/key')
});
