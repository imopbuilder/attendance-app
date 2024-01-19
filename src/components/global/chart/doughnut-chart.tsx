'use client';

import { cn } from '@/lib/utils/cn';
import { Chart as ChartJS } from 'chart.js/auto';
import { type ComponentPropsWithoutRef } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register();

export const DoughnutChart = ({ className, ...restProps }: ComponentPropsWithoutRef<typeof Doughnut>) => {
	return <Doughnut className={cn('', className)} {...restProps} />;
};
