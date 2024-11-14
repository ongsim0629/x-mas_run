import * as THREE from 'three'
import React from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type ActionName = '000_mesh_id5Action.001'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh
  }
  materials: {
    ['82_fc41278a-fda6-4710-ab33-27c01fb966e7']: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Tail(props: JSX.IntrinsicElements['group']) {
  const group = React.useRef<THREE.Group>()
  const { nodes, materials, animations } = useGLTF('/models/Tail.glb') as GLTFResult
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group name="000_mesh_id5_0" rotation={[1.569, -0.004, 0.005]}>
                <mesh name="Object_4" geometry={nodes.Object_4.geometry} material={materials['82_fc41278a-fda6-4710-ab33-27c01fb966e7']} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/Tail.glb')
