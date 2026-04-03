import ShapeGrid from './ShapeGrid';
import Aurora from './Aurora';

export default function BackgroundLayer() {
  return (
    <div className="background-layer">
      <div className="background-grid">
        <ShapeGrid
          direction="diagonal"
          speed={0.2}
          borderColor="rgba(255,255,255,0.08)"
          squareSize={50}
          hoverFillColor="rgba(255,255,255,0.05)"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>
      <div className="background-aurora">
        <Aurora
          colorStops={['#00f0ff', '#7b2fff', '#ff0080']}
          amplitude={1.5}
          blend={0.6}
          speed={0.2}
        />
      </div>
    </div>
  );
}
