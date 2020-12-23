import { trigger, state, style, transition, animate } from '@angular/animations';

export const DetailsPaneAnimations = [
    trigger('criticalDatePane', [
        state('tableCriticalDateMode', style({display: 'block'})),
        state('editCriticalDateMode', style({display: 'none'})),
    ]),
    trigger('editCriticalDatePane', [
        state('tableCriticalDateMode', style({display: 'none'})),
        state('editCriticalDateMode', style({display: 'block'})),
    ]),
];