import { createRoot } from 'react-dom/client'
import React, { useRef, useState, useEffect } from 'react'
import { Vector3, Ray, MathUtils, BoxHelper, Box3, BoxGeometry, Matrix4, Mesh, MeshBasicMaterial } from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls, useHelper, TransformControls } from '@react-three/drei';

import './index.css';

function Model(props) {

  const geometry = useLoader(STLLoader, './Head.stl');
  const [boxGeo, setBoxGeo ] = useState(null);

  // This reference will give us direct access to the mesh
  const mesh = useRef()
  const boxMesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false);
  const [go, setGo] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useHelper(mesh, BoxHelper, 'cyan')

  useEffect(() => {
    // create your box mesh here
    if(mesh){
      const box3 = new Box3();
      box3.setFromObject(mesh.current);

      // make a BoxBufferGeometry of the same size as Box3
      const dimensions = new Vector3().subVectors( box3.max, box3.min );
      const myBoxGeo = new BoxGeometry(dimensions.x, dimensions.y, dimensions.z);

      // move new mesh center so it's aligned with the original object
      const matrix = new Matrix4().setPosition(dimensions.addVectors(box3.min, box3.max).multiplyScalar( 0.5 ));
      myBoxGeo.applyMatrix4(matrix);
      setBoxGeo(myBoxGeo);
      setGo(true);
    }

  }, [mesh.current]);

  useFrame((state, delta) => {
    if(go){
      mesh.current.rotation.x += delta;
      boxMesh.current.rotation.x += delta;
    }

  })



  // Return view, these are regular three.js elements expressed in JSX
  return (
    <>
      { boxGeo != null &&
        <mesh
          ref={ boxMesh }
        >
          <primitive object={ boxGeo } attach="geometry" />
          <meshStandardMaterial color='red' wireframe />
        </mesh>
    }

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
