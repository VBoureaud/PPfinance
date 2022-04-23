import React, { useState } from 'react';
import { ColorPicker, useColor } from "react-color-palette";
import { Steps, Modal, Button, Typography, message } from 'antd';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import "react-color-palette/lib/css/styles.css";
import "./NftView.css";

const { Step } = Steps;

// props.tokenId
// props.confirmBuy
// props.visible
// props.setVisible
// props.loading
function NftView(props) {
	const [color, setColor] = useColor("hex", "#121212");
	const [isBuy, setIsBuy] = React.useState(false);
	const [current, setCurrent] = React.useState(0);
	const next = () => {
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	const handleConfirm = () => {
		const rgbArr = [
			color.rgb.r,
			color.rgb.g,
			color.rgb.b,
		];
		props.confirmBuy(rgbArr);
		// todo - displayConfirm when it done
		//props.setVisible(false);
	}


	const steps = [
		{
			title: 'Choose a color',
			content: <ColorPicker width={456} height={228} color={color} onChange={setColor} hideHSV dark />,
		},
		{
			title: 'Confirm',
			content: (
				<>
					<Typography>Color choosed: {color.hex}</Typography>
					<Button style={{ width: '100%' }} type="primary" onClick={handleConfirm}>
						Buy it
					</Button>
				</>
			),
		},
	];

	return (
		<Modal
			title={'Token n°' + props.tokenId}
			style={{
				right: 0,
				width: '50%',
				position: 'fixed',
				top: 0,
				bottom: 0,
			}}
			bodyStyle={{ height: 'calc(100vh - 108px)' }}
			visible={props.visible}
			onOk={() => props.setVisible(false)}
			onCancel={() => props.setVisible(false)}
		>
			{props.loading && <Icon component={LoadingOutlined} />}
			{!props.loading && 
				<>
					{!isBuy && <div>
						<Typography>Creation Date: 1234567890</Typography>
						<Typography>Last Buy Date: 1234567890</Typography>
						<Typography>No Time Bought: 5</Typography>
						<Typography>Owner: 0x000000</Typography>
						<Typography>Price: 1</Typography>
						<Typography>Want it ?</Typography>
						<Button style={{ width: '100%' }} type="primary" onClick={() => setIsBuy(true)}>
							Buy it
						</Button>
					</div>}

					{isBuy && <>
							<Steps current={current}>
								{steps.map(item => (
									<Step key={item.title} title={item.title} />
								))}
							</Steps>
							<div className="steps-content">{steps[current].content}</div>


							<div className="steps-action">
								{current < steps.length - 1 && (
									<Button type="primary" onClick={() => next()}>
										Next
									</Button>
								)}
								{current === steps.length - 1 && (
									<Button type="primary" onClick={() => message.success('Processing complete!')}>
										Done
									</Button>
								)}
								{current > 0 && (
									<Button style={{ margin: '0 8px' }} onClick={() => prev()}>
										Previous
									</Button>
								)}
							</div>
						</>
					}
				</>
			}
		</Modal>
	);
}

export default NftView;
