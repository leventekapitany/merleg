import React from 'react'

import styled from 'styled-components'

import Caret from '../assets/caret.svg'

interface NavButtonProps {
  right?: boolean
  left?: boolean
  down?: boolean
  onClick?: () => void
  large?: boolean
}

const NavButton: React.FC<NavButtonProps> = ({ right, left, down, large }) => {
  let degree: number

  if (right) {
    degree = -90
  } else if (left) {
    degree = 90
  } else if (down) {
    degree = 0
  } else {
    degree = 180
  }

  const Image = styled('img')`
    height: var(--size);
    ${large ? 'height: 50px;' : ''}
    transform: rotate(${degree}deg);
  `

  return (
    <Button>
      <Image src={Caret} alt="Caret" />
    </Button>
  )
}

export default NavButton

const Button = styled('button')`
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
`
