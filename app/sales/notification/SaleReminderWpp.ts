import { Sale } from '@/interface/Sale'
import { getDialByCountry } from '@/utils/getDialByCountry'
import dayjs from 'dayjs'

class SaleReminderWpp {
  static sendByWhatsapp: (sale: Sale) => Promise<any> = sale => {
    console.log('sale:', sale)
    return new Promise(resolve => {
      getDialByCountry(sale?.client.country ?? '').then((dial = '') => {
        const days = dayjs(sale.expiration).diff(dayjs().startOf('day'), 'days')
        const baseUrl = `https://api.whatsapp.com/send?phone=${dial}${sale?.client.phone}&text=`
        const msgWithoutFormat = `*Notificación de pronta finalización de suscripción*
Atención tu suscripción a ${sale.account.service.name} finaliza en ${days} días. Por favor hacer el pago correspondiente para poder seguir disfrutando de nuestros servicios. Nequi: 3213411415 ¡No te quedes sin tu activación!`
        const msgWithFormat = encodeURIComponent(msgWithoutFormat)
        const url = baseUrl + msgWithFormat
        window.open(url, '_blank')
        resolve(null)
      })
    })
  }
}

export default SaleReminderWpp
