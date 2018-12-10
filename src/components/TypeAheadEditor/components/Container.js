import styled from "styled-components"

export default styled("div")`
	position: relative;

	.trigger-icon {
		z-index: 99;
		position: absolute;
		top: 5px;
		right: 7px;
		font-size: 16px;
		cursor: pointer;

		&:hover {
			& ~ .editor {
				border: 1px solid #d9d9d9;
			}
			opacity: 0.8;
		}
	}

	.editor {
		position: relative;
		touch-action: manipulation;
		-webkit-appearance: none;
		font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB",
			"Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
			"Segoe UI Symbol";
		-webkit-font-feature-settings: "tnum";
		font-feature-settings: "tnum";
		font-variant: tabular-nums;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		list-style: none;
		position: relative;
		display: inline-block;
		padding: 4px 11px;
		width: 100%;
		min-height: 32px;
		font-size: 14px;
		line-height: 1;
		color: rgba(0, 0, 0, 0.65);
		background-color: #fff;
		background-image: none;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;

		&:focus {
			border-color: #40a9ff;
			outline: 0;
			box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
			border-right-width: 1px !important;
		}

		&:hover {
			border-color: #40a9ff;
			border-right-width: 1px !important;
		}
	}
`
