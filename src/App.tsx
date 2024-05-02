import styled from 'styled-components'

import Daily from './pages/Daily'

export default function App() {
  return (
    <Container>
      <Daily />
    </Container>
  )
}

const Container = styled('div')`
  display: block;
  margin: auto;
  max-width: 600px;
  width: 100%;
  height: 100%;
  color: #656565;
`
