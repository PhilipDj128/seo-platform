import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle className="text-white">{project.domainUrl}</CardTitle>
          <p className="text-sm text-slate-300">{project.industry}</p>
        </div>
        <span className="badge">
          {new Date(project.createdAt ?? Date.now()).toLocaleDateString("sv-SE")}
        </span>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-200">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-slate-400">
            Städer
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {project.cities?.length ? (
              project.cities.map((city) => (
                <span
                  key={city}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white"
                >
                  {city}
                </span>
              ))
            ) : (
              <span className="text-slate-400">Inga städer angivna</span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-slate-400">Domän</p>
            <p className="font-medium text-white">{project.domainUrl}</p>
          </div>
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-slate-400">Bransch</p>
            <p className="font-medium text-white">{project.industry}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


