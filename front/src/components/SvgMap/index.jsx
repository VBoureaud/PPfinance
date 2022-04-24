import React, { useRef, useEffect, useState } from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import { Button, Typography } from "antd";
import { coordToTokenId } from '../../utils';
import initial_indexes from "./assets/initial_indexes.json";

export default function SvgMap(props) {
  const Viewer = useRef(null);
  const [currentPixel, setCurrentPixel] = useState(null);

  const sizeBox = props.sizeBox;
  const paddBox = props.paddBox;
  const xNum = props.xNum;
  const yNum = props.yNum;
  const colors = "004b23-006400-007200-008000-38b000-70e000-9ef01a-ccff33".split('-');

  const range = n => Array.from(Array(n).keys())

  useEffect(() => {
    Viewer.current.fitSelection(0, 0, (sizeBox + paddBox) * xNum, (sizeBox + paddBox) * yNum);
  }, []);

  /* Read all the available methods in the documentation */
  const _zoomOnViewerCenter = () => Viewer.current.zoomOnViewerCenter(1.1)
  const _fitSelection = () => Viewer.current.fitSelection(40, 40, 200, 200)
  const _fitToViewer = () => Viewer.current.fitToViewer('center')

  const getTokenColor = (x, y) => {
    const defaultColor = '#555';
    const initialToken = 'tomato';
    const tokenId = coordToTokenId(parseInt(x), parseInt(y), xNum);
    
    //const randColor = '#' + colors[parseInt(Math.random() * colors.length)];
    if (initial_indexes.indexes.indexOf(tokenId) != -1) {
      return initialToken;
    }
    return defaultColor;
  }

  const handleClick = (event) => {
    //console.log(event.x, event.y, event.originalEvent);
    if (event 
      && event.originalEvent
      && event.originalEvent.target
      && event.originalEvent.target.id) {
      console.log(event.originalEvent.target.id);
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
                range(xNum * yNum).map((e, key) => {
                  const x = key % xNum;
                  const y = Math.floor(key / yNum);
                  const id = y + '-' + x;
                  const xSize = sizeBox + (sizeBox + paddBox) * x;
                  const ySize = sizeBox + (sizeBox + paddBox) * y;
                  
                  //const newX = tokenId % maxWidth;
                  //const newY = Math.floor(tokenId / maxHeight);

                  return <rect 
                    id={id}
                    key={id}
                    x={xSize}
                    y={ySize}
                    stroke={id === currentPixel ? "#ff2626" : ''}
                    strokeWidth={id === currentPixel ? 1 : 0}
                    width={sizeBox}
                    height={sizeBox}
                    fill={getTokenColor(x, y)}
                    //fill={'#' + colors[parseInt(Math.random() * colors.length)]}
                  />
                })
              }
            </g>
          </svg>
        </UncontrolledReactSVGPanZoom>
      </div>
    </div>
  )
}