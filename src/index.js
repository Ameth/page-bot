import express from 'express'
import fetch from 'node-fetch'

const app = express()
const port = process.env.PORT || 8000
const ip = 'http://localhost'

const URL_TO_CHECK = 'http://127.0.0.1:3000/' // URL to check
const TIME_CHECK = 10000 //milisegundos
const STOP_IN_LINE = true // true => Detener la comprobación una vez que la página este en línea.

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

function convertTime() {
  return '' + TIME_CHECK / 1000
}

async function checkWebSite(url) {
  try {
    const response = await fetch(url)
    if (response.status === 200) {
      return { success: true, message: 'Página web en línea' }
    } else {
      return {
        success: false,
        message: `Código ${
          response.status
        }. La página no está en línea. Reintentando en ${convertTime()} segundos.`,
      }
    }
  } catch (err) {
    // console.error(err)
    // console.log('La página no está en linea. Reintentando en 1 minuto.')
    return {
      success: false,
      message: `La página no está en línea. Reintentando en ${convertTime()} segundos.`,
    }
  }
}

app.get('/check', (req, res) => {
  try {
    res.send('Comprobando la página web. Espere un momento...')
    const intervalId = setInterval(async () => {
      const { success, message } = await checkWebSite(URL_TO_CHECK)
      console.log(message)
      if (success && STOP_IN_LINE) {
        clearInterval(intervalId)
      }
    }, TIME_CHECK)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error al iniciar la comprobación de la página web')
  }
})

app.get('/', async (request, response) => {
  response.send('Hola mi servidor en Express')
  console.log('Consola funcionando...')
})

app.listen(port, () => {
  // No deberia mostrar logs en modo de producción
  console.log('Servidor corriendo en ' + ip + ':' + port)
})
