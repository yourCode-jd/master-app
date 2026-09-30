"use client";
import { ArrowLeft, ArrowRight, ExternalLink, SkipForward, X } from "lucide-react";
import { advanceTrainingStep, exitTraining, previousTrainingStep, skipTrainingStep } from "@/app/actions/training";
import type { TrainingScenario } from "@/lib/training";

export function TrainingGuide({ scenario, stepIndex }: { scenario: TrainingScenario; stepIndex: number }) {
  const step = scenario.steps[Math.min(stepIndex, scenario.steps.length - 1)]; const last = stepIndex >= scenario.steps.length - 1;
  return <aside className="training-guide" aria-label="Training step"><div className="training-guide-top"><span>TRAINING MODE</span><form action={exitTraining}><input type="hidden" name="scenarioId" value={scenario.id}/><button aria-label="Exit training"><X size={17}/></button></form></div><p className="small">Step {stepIndex + 1} of {scenario.steps.length}</p><h2>{step.title}</h2><p>{step.explanation}</p><dl><div><dt>Look at</dt><dd>{step.lookAt}</dd></div><div><dt>Action</dt><dd>{step.action}</dd></div></dl><a className="button button-outline" href={step.href}>Open page <ExternalLink size={15}/></a><div className="training-guide-actions"><form action={previousTrainingStep}><input type="hidden" name="scenarioId" value={scenario.id}/><button className="button button-ghost" disabled={stepIndex === 0}><ArrowLeft size={16}/> Back</button></form><form action={skipTrainingStep}><input type="hidden" name="scenarioId" value={scenario.id}/><button className="button button-ghost"><SkipForward size={16}/> Skip</button></form><form action={advanceTrainingStep}><input type="hidden" name="scenarioId" value={scenario.id}/><button className="button button-primary">{last ? "Finish" : "Next"} <ArrowRight size={16}/></button></form></div></aside>;
}
