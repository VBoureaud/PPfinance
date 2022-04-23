import React, { useRef, useEffect, useState } from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import { Button, Typography } from "antd";

export default function SvgMap(props) {
  const Viewer = useRef(null);
  const [currentPixel, setCurrentPixel] = useState(null);

  const sizeBox = 15;
  const paddBox = 1;
  const xNum = 100;
  const yNum = 100;
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

      if (props.onClick)
        props.onClick({ x: parseInt(coord[1]), y: parseInt(coord[0]) });
    }
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <Button type="primary" onClick={() => _fitToViewer()}>
        Reset
      </Button>

      <div style={{ background: '#333' }}>
        <UncontrolledReactSVGPanZoom
          ref={Viewer}
          //defaultTool="pan"
          background="#333"
          SVGBackground="#333"
          width={props.width - 50} height={props.height - 220}
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
                      stroke={id === currentPixel ? "#ff2626" : ''}
                      strokeWidth={id === currentPixel ? 1 : 0}
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
    </div>
  )
}