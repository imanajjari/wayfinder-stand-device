// src/pages/navigator/components/LightsRig.jsx
export default function LightsRig() {
    return (
      <>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10,10,10]} intensity={1.2} castShadow />
        <directionalLight position={[0,0,10]} intensity={1.2} castShadow />
        <directionalLight position={[-10,0,10]} intensity={1.2} castShadow />
        <pointLight position={[0,10,0]} intensity={0.5} />
      </>
    );
  }
  