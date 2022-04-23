import React, { useRef, useEffect, useState } from 'react';
import {UncontrolledReactSVGPanZoom, setPointOnViewerCenter} from 'react-svg-pan-zoom';


export default function SvgMap() {
  const Viewer = useRef(null);
  const [currentPixel, setCurrentPixel] = useState(null);

  const sizeBox = 40;
  const paddBox = 2;
  const xNum = 10;
  const yNum = 10;
  const colors = "004b23-006400-007200-008000-38b000-70e000-9ef01a-ccff33".split('-');

  const range = n => Array.from(Array(n).keys())

  useEffect(() => {
    Viewer.current.fitToViewer();
  }, []);

  /* Read all the available methods in the documentation */
  const _zoomOnViewerCenter = () => Viewer.current.zoomOnViewerCenter(1.1)
  const _fitSelection = () => Viewer.current.fitSelection(40, 40, 200, 200)
  const _fitToViewer = () => Viewer.current.fitToViewer()

  const handleClick = (event) => {
    //console.log(event.x, event.y, event.originalEvent);
    if (event 
      && event.originalEvent
      && event.originalEvent.target
      && event.originalEvent.target.id) {
      const target = event.originalEvent.target;
      setCurrentPixel(target.id);
      const coord = target.id.split('-');
      const x = sizeBox + ((sizeBox + paddBox) * coord[1]);
      const y = sizeBox + ((sizeBox + paddBox) * coord[0]);
      const viewWind = 200;

      Viewer.current.fitSelection(
        x - viewWind / 2,
        y - viewWind / 2,
        viewWind,
        viewWind
      );
    }
  }

  return (
    <div>
      
      <button className="btn" onClick={() => _zoomOnViewerCenter()}>Zoom on center</button>
      <button className="btn" onClick={() => _fitSelection()}>Zoom area 200x200</button>
      <button className="btn" onClick={() => _fitToViewer()}>Fit</button>
      <hr/>

      <UncontrolledReactSVGPanZoom
        ref={Viewer}
        //defaultTool="pan"
        background="#333"
        SVGBackground="#333"
        width={window.innerWidth} height={window.innerHeight}
        onZoom={e => console.log('zoom')}
        onPan={e => console.log('pan')}
        onClick={event => handleClick(event)}
      >
        <svg width={617} height={316}>
          <g fillOpacity=".5" strokeWidth="4">
            {
              range(yNum).map((e, key) => {
                return range(xNum).map((e2, key2) => {
                  const id = key + '-' + key2;
                  const x = sizeBox + (sizeBox + paddBox) * key2;
                  const y = sizeBox + (sizeBox + paddBox) * key;
                  return <rect 
                    id={id}
                    key={id}
                    x={x}
                    y={y}
                    stroke={id == currentPixel ? "#ff2626" : ''}
                    strokeWidth={id == currentPixel ? 1 : 0}
                    width={sizeBox}
                    height={sizeBox}
                    //fill="#CCC"
                    fill={'#' + colors[parseInt(Math.random() * colors.length)]}
                  />
                })
              })
            }
          </g>
        </svg>
      </UncontrolledReactSVGPanZoom>
    </div>
  )
}