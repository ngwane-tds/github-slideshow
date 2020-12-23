import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

export const HomeAnimations = [
  trigger("tablePane", [
    state("tableMode", style({ transform: "translate3d(0, 0%, 0)" })),
    state("detailsMode", style({ transform: "translate3d(0, 0%, 0)" })),
    transition(
      "tableMode <=> detailsMode",
      animate("500ms cubic-bezier(0.35, 0, 0.25, 1)")
    )
  ]),
  trigger("detailsPane", [
    state("tableMode", style({ transform: "translate3d(-100%, 0, 0)" })),
    state("detailsMode", style({ transform: "translate3d(0%, 0, 0)" })),
    transition(
      "tableMode <=> detailsMode",
      animate("500ms cubic-bezier(0.35, 0, 0.25, 1)")
    )
  ]),
  trigger("fab", [
    // state('tableMode', style({transform: 'translate3d(36px, calc(100vh - 400px), 0)'})),
    // state('detailsMode', style({transform: 'translate3d(798px, 72px, 0)'})),
    state(
      "tableMode",
      style({ transform: "translate3d(20px, calc(100% - 14px), 0)" })
    ),
    state(
      "detailsMode",
      style({ transform: `translate3d(calc(100% + 10px), 6px, 0)` })
    ),
    transition(
      "tableMode <=> detailsMode",
      animate("500ms cubic-bezier(0.35, 0, 0.25, 1)")
    )
  ]),
  trigger("admin", [
    state("homeMode", style({ display: "none" })),
    state("adminMode", style({ display: "block" }))
  ]),
  trigger("home", [
    state("adminMode", style({ display: "none" })),
    state("homeMode", style({ display: "block" }))
  ]),
  trigger("map", [
    state("adminMode", style({ display: "none" })),
    state("homeMode", style({ display: "block" }))
  ])
];
