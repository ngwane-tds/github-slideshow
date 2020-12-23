import { trigger, state, style, transition, animate } from '@angular/animations';

export const AdminAnimations = [
  trigger('tablePane', [
    state('tableMode', style({ display: 'block' })),
    state('editMode', style({ display: 'none' })),
    state('addMode', style({ display: 'none' }))
  ]),
  trigger('editPane', [
    state('tableMode', style({ display: 'none' })),
    state('editMode', style({ display: 'block' })),
    state('addMode', style({ display: 'none' }))
  ]),
  trigger('addPane', [
    state('tableMode', style({ display: 'none' })),
    state('editMode', style({ display: 'none' })),
    state('addMode', style({ display: 'block' }))
  ])
];
