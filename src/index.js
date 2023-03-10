import { createRoot } from 'react-dom/client'
import React, { useRef, useState, useEffect } from 'react'
import { BoxHelper } from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls, useHelper, TransformControls } from '@react-three/drei';

import './index.css';

function Model(props) {

  const geometry = useLoader(STLLoader, './Head.stl');

  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame

  // useFrame((state, delta) => (mesh.current.rotation.x += delta))
  useHelper(mesh, BoxHelper, 'cyan')
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <>
      <mesh
        {...props}
        ref={mesh}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
      {active && <TransformControls
          mode="rotate"
          object={ mesh }
      />}
    </>
  )
}

function Experience(props){
  const camera = useRef();

  return (
    <Canvas>
      <OrbitControls makeDefault ref={ camera } position={ [50, 50, 50 ] }/>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Model position={[0, 0, 0]} />
    </Canvas>
  );
}

createRoot(document.getElementById('root')).render(
  <Experience />
)
