'use client';

import { cn } from '@/lib/utils/cn';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js/auto';
import { type ComponentPropsWithoutRef } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ className, ...restProps }: ComponentPropsWithoutRef<typeof Doughnut>) => {
	return <Doughnut className={cn('', className)} {...restProps} />;
};
