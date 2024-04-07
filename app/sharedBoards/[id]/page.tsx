'use client'

function SharedBoardView ({ params }: { params: { id: string } }) {
  // Utiliza el ID como necesites en tu componente
  return <p>ID: {params.id}</p>
}

export default SharedBoardView
