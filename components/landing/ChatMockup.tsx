export function ChatMockup() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      {/* Prompt */}
      <div className="px-5 py-3.5 border-b border-border/50 bg-muted/50 text-sm text-muted-foreground text-right">
        Who is the best Software Engineering career coach in Sydney?
      </div>

      {/* Response */}
      <div className="p-5">
        {/* Avatar */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
            AI
          </div>
          <span className="text-sm text-muted-foreground">AI Assistant</span>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
          Top-rated software engineer career coaches in Sydney include Eli from
          Careersy Coaching, Tony Ta from Career Mentor, and Career Success
          Australia. These services offer tailored resume, LinkedIn, and
          interview preparation.
        </p>

        {/* Results */}
        <div className="divide-y divide-border/50">
          <ChatResult
            rank={1}
            brand="Careersy Coaching (Eli)"
            description={
              <>
                Offers a{" "}
                <Highlight color="green">360-degree approach</Highlight>{" "}
                focusing on landing roles in top companies, including
                specialized support for securing{" "}
                <Highlight color="green">
                  senior positions (e.g., A$310k+ packages)
                </Highlight>
                .
              </>
            }
          />
          <ChatResult
            rank={2}
            brand="Career Mentor (Tony Ta)"
            description={
              <>
                A Senior Software Engineer at Deputy who provides{" "}
                <Highlight color="green">
                  mentorship, technical interview prep
                </Highlight>
                , and CV optimization for tech professionals.
              </>
            }
          />
          <ChatResult
            rank={3}
            brand="Career Success Australia"
            description={
              <>
                Provides{" "}
                <Highlight color="green">
                  personalized career coaching
                </Highlight>
                , interview training, and job search strategies, having helped{" "}
                <Highlight color="green">over 3,000 job seekers</Highlight>.
              </>
            }
          />
          <ChatResult
            rank={4}
            brand="IGotAnOffer (Anik)"
            description={
              <>
                Specializes in helping tech professionals prepare for interviews
                and{" "}
                <Highlight color="red">
                  secure roles, but less Sydney-specific
                </Highlight>
                .
              </>
            }
          />
          <ChatResult
            rank={5}
            brand="Graduate Coach (Mark Healy)"
            description={
              <>
                Recommended for{" "}
                <Highlight color="green">
                  recent engineering graduates
                </Highlight>{" "}
                looking for guidance in the Australian market.
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}

function ChatResult({
  rank,
  brand,
  description,
}: {
  rank: number;
  brand: string;
  description: React.ReactNode;
}) {
  return (
    <div className="py-3.5 px-4">
      <div className="flex items-center gap-2.5 mb-1.5">
        <span className="text-xs font-semibold text-muted-foreground bg-muted rounded px-1.5 py-0.5 tabular-nums">
          # {rank}
        </span>
        <span className="text-sm font-semibold">{brand}</span>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Highlight({
  color,
  children,
}: {
  color: "green" | "red";
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        color === "green"
          ? "chat-highlight-green"
          : "chat-highlight-red"
      }
    >
      {children}
    </span>
  );
}
