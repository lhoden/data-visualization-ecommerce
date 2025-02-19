import styled, { keyframes } from 'styled-components';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

const FadeInOpacity = keyframes`
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`;

export const StyledTable = styled(Table)`
    opacity: 1;
	animation-name: ${FadeInOpacity};
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.5s;
    margin: 10em 5em 0 5em;
`;