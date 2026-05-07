import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

const CyberModel = () => {
  return (
    <Canvas className="absolute top-0 left-0 w-full h-full z-0">
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
      {/* Replace with your model */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};
export default CyberModel;
