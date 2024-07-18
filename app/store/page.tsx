'use client'
import { DollarOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Image, Modal, Row } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useState } from 'react'
import LattvForm from './lattv/LattvForm'
import IptvPremiunForm from './iptvPremiun/IptvPremiunForm'

type AvailableServices = 'LATTV' | 'IPTV PREMIUN' | null

const Page: React.FC = () => {
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [selectedService, setSelectedService] =
    useState<AvailableServices>(null)
  const onOpenModal = (service: AvailableServices) => {
    setBuyModalOpen(true)
    setSelectedService(service)
  }
  const onCloseModal = () => {
    setBuyModalOpen(false)
    setSelectedService(null)
  }
  return (
    <Row gutter={[16, 16]} justify='center' style={{ paddingTop: '1rem' }}>
      <Col xs={22} sm={12} md={8} lg={6} xl={4}>
        <Card
          style={{ width: '100%' }}
          cover={
            <Image
              alt='example'
              src='https://play-lh.googleusercontent.com/VaA3qeVPyKS4i-HcErOQNx2L3S4FwHEgQqo6mY11mqwFQWlSz1M2b-zwD3rtOJYos2bv=w300'
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          }
          actions={[<DollarOutlined key='buy' onClick={() => onOpenModal('LATTV')} />]}
        >
          <Meta
            avatar={
              <Button
                icon={<InfoCircleOutlined />}
                shape='circle'
                size='small'
              />
            }
            title='Lattv'
            description='Servicio de IPTV a bajo costo'
          />
        </Card>
      </Col>
      <Col xs={22} sm={12} md={8} lg={6} xl={4}>
        <Card
          style={{ width: '100%' }}
          cover={
            <Image
              alt='example'
              src='https://web.iptvpremium.ink/img/logo.png'
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          }
          actions={[<DollarOutlined key='buy' onClick={() => onOpenModal('IPTV PREMIUN')} />]}
        >
          <Meta
            avatar={
              <Button
                icon={<InfoCircleOutlined />}
                shape='circle'
                size='small'
              />
            }
            title='IPTV Premium'
            description='Servicio de IPTV de calidad'
          />
        </Card>
      </Col>
      <Modal open={buyModalOpen} onCancel={onCloseModal} footer={null} destroyOnClose title={`Comprar ${selectedService}`}>
        {
          selectedService === 'LATTV' && <LattvForm onCancel={onCloseModal} />
        }
        {
          selectedService === 'IPTV PREMIUN' && <IptvPremiunForm onCancel={onCloseModal} />
        }
      </Modal>
    </Row>
  )
}
export default Page
