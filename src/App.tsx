import { useEffect, useRef, useState } from "react";

type IconName =
  | "grid"
  | "book"
  | "scan"
  | "spark"
  | "users"
  | "chart"
  | "settings"
  | "bell"
  | "search"
  | "upload"
  | "chevron"
  | "arrow"
  | "file"
  | "check"
  | "clock"
  | "alert"
  | "shield"
  | "more"
  | "plus"
  | "external"
  | "soldier";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 7h8M8 11h6" /></>,
    scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10M12 7v10" /></>,
    spark: <><path d="m12 3-1.7 4.3L6 9l4.3 1.7L12 15l1.7-4.3L18 9l-4.3-1.7L12 3Z" /><path d="m5 15-.8 2.2L2 18l2.2.8L5 21l.8-2.2L8 18l-2.2-.8L5 15ZM19 14l-.6 1.4L17 16l1.4.6L19 18l.6-1.4L21 16l-1.4-.6L19 14Z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 16 4-5 4 3 5-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.1v-4H3A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88L4.2 6.66l2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.1h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.36.36.7.6 1 .27.3.62.42 1 .4h.1v4H21a1.7 1.7 0 0 0-1.6.6Z" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    alert: <><path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.8 3h16a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    external: <><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    soldier: <><circle cx="12" cy="7" r="3" /><path d="M6 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2" /><path d="M8 4.5C8 4.5 9 3 12 3s4 1.5 4 1.5" /><path d="M7 4h10l1 2H6L7 4Z" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", icon, onClick }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; icon?: IconName; onClick?: () => void }) {
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  return <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => event.key === "Enter" && onClick?.()} className={`inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${styles[variant]}`}>{icon && <Icon name={icon} className="size-4" />}{children}</div>;
}

function Badge({ children, tone = "neutral", plain = false }: { children: React.ReactNode; tone?: "neutral" | "green" | "amber" | "blue" | "red" | "purple" | "teal"; plain?: boolean }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-rose-50 text-rose-700",
    purple: "bg-violet-50 text-violet-700",
    teal: "bg-teal-50 text-teal-700",
  };
  const plainTones = {
    neutral: "text-slate-600",
    green: "text-emerald-700",
    amber: "text-amber-700",
    blue: "text-blue-700",
    red: "text-rose-700",
    purple: "text-violet-700",
    teal: "text-teal-700",
  };
  return <span className={`inline-flex items-center text-xs font-semibold ${plain ? plainTones[tone] : `rounded-md px-2.5 py-1 ${tones[tone]}`}`}>{children}</span>;
}

function RegistrationPage({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [selectedRegistrationField, setSelectedRegistrationField] = useState("");
  const [isRegistrationFieldOpen, setIsRegistrationFieldOpen] = useState(false);
  const registrationFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeFieldMenu = (event: PointerEvent) => {
      if (registrationFieldRef.current && !registrationFieldRef.current.contains(event.target as Node)) {
        setIsRegistrationFieldOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeFieldMenu);
    return () => document.removeEventListener("pointerdown", closeFieldMenu);
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-5 md:p-8">
      <div
        role="button"
        tabIndex={0}
        onClick={onBack}
        onKeyDown={(event) => event.key === "Enter" && onBack()}
        className="mb-7 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <Icon name="chevron" className="size-4 rotate-180" />
        교범 관리로 돌아가기
      </div>

      <div className="mb-8">
        <div className="text-3xl font-black tracking-tight">교범 등록</div>
        <p className="mt-2 text-sm text-slate-500">새로운 훈련 교범과 기본 정보를 등록합니다.</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
          <div className="mb-4">
            <div className="text-lg font-extrabold">기본 정보</div>
            <p className="mt-1 text-sm text-slate-500">교범을 구분하고 관리하는 데 필요한 정보를 입력해 주세요.</p>
          </div>
          <div className="grid gap-4">
            <div>
              <div className="mb-2 text-sm font-bold text-slate-700">교범명 <span className="text-rose-500">*</span></div>
              <div role="textbox" contentEditable suppressContentEditableWarning className="min-h-11 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"></div>
            </div>
            <div ref={registrationFieldRef} className="relative">
              <div className="mb-2 text-sm font-bold text-slate-700">훈련 분야 <span className="text-rose-500">*</span></div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsRegistrationFieldOpen((open) => !open)}
                onKeyDown={(event) => event.key === "Enter" && setIsRegistrationFieldOpen((open) => !open)}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm ${isRegistrationFieldOpen ? "border-slate-400" : "border-slate-200"} ${selectedRegistrationField ? "font-semibold text-slate-700" : "text-slate-400"}`}
              >
                {selectedRegistrationField || "분야를 선택해 주세요"}
                <Icon name="chevron" className={`size-4 transition-transform ${isRegistrationFieldOpen ? "-rotate-90" : "rotate-90"}`} />
              </div>
              {isRegistrationFieldOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70">
                  {trainingFields.slice(1).map((field) => (
                    <div
                      key={field}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedRegistrationField(field);
                        setIsRegistrationFieldOpen(false);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          setSelectedRegistrationField(field);
                          setIsRegistrationFieldOpen(false);
                        }
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm ${selectedRegistrationField === field ? "bg-slate-900 font-bold text-white" : "font-medium text-slate-600 hover:bg-slate-100"}`}
                    >
                      {field}
                      {selectedRegistrationField === field && <Icon name="check" className="size-4" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="mb-2 text-sm font-bold text-slate-700">교범 설명</div>
              <div role="textbox" contentEditable suppressContentEditableWarning className="min-h-20 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"></div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
          <div className="mb-6">
            <div className="text-lg font-extrabold">교범 파일</div>
            <p className="mt-1 text-sm text-slate-500">AI 지식 추출에 사용할 원본 자료를 첨부해 주세요.</p>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition-colors hover:border-slate-400 hover:bg-slate-100">
            <div className="flex size-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"><Icon name="upload" /></div>
            <div className="mt-4 text-sm font-extrabold">파일을 끌어다 놓거나 선택하세요</div>
            <p className="mt-2 text-xs text-slate-400">PDF, PPT, PPTX, DOCX 형식 · 파일당 최대 100MB</p>
            <div className="mt-5"><Button variant="secondary">파일 선택</Button></div>
          </div>
        </section>

      </div>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Button variant="secondary" onClick={onBack}>취소</Button>
        <Button icon="check" onClick={onSave}>저장</Button>
      </div>
    </div>
  );
}

const navigation = [
  { label: "교범 관리", icon: "book" as IconName, count: 12 },
  { label: "문제 관리", icon: "grid" as IconName },
  { label: "훈련 세션", icon: "users" as IconName },
  { label: "평가 · AAR", icon: "chart" as IconName },
];

const documents = [
  { name: "화생방 방호 교육교재", version: "v2.1", type: "PDF", field: "핵 및 화생방", state: "검수 필요", tone: "amber" as const, date: "오늘 09:42" },
  { name: "CBRN 상황별 행동절차", version: "v1.4", type: "PPT", field: "핵 및 화생방", state: "추출 중", tone: "blue" as const, date: "어제 16:18" },
  { name: "방독면 착용 및 점검 교범", version: "v3.0", type: "PDF", field: "핵 및 화생방", state: "검수 완료", tone: "green" as const, date: "6월 18일" },
  { name: "오염지역 분대 행동지침", version: "v1.0", type: "DOCX", field: "핵 및 화생방", state: "임시 저장", tone: "neutral" as const, date: "6월 17일" },
  { name: "전투부상자 응급처치 지침", version: "v2.2", type: "PDF", field: "전투부상자처치 / 응급처치", state: "문제 검수 완료", tone: "teal" as const, date: "6월 16일" },
  { name: "개인 기본사격 훈련교범", version: "v1.8", type: "PDF", field: "사격", state: "문제 검수 필요", tone: "purple" as const, date: "6월 14일" },
  { name: "각개전투 행동요령", version: "v1.3", type: "PPT", field: "각개전투", state: "검수 필요", tone: "amber" as const, date: "6월 12일" },
  { name: "수류탄 투척 안전수칙", version: "v2.0", type: "PDF", field: "수류탄 훈련", state: "문제 생성 중", tone: "blue" as const, date: "6월 10일" },
  { name: "완전군장 행군 교육자료", version: "v1.1", type: "PPT", field: "행군", state: "검수 완료", tone: "green" as const, date: "6월 8일" },
  { name: "경계근무 및 감시 절차", version: "v1.6", type: "PDF", field: "경계 / 감시 관련 교육", state: "검수 필요", tone: "amber" as const, date: "6월 6일" },
  { name: "야간 이동 및 식별 훈련", version: "v1.0", type: "DOCX", field: "야간훈련", state: "추출 중", tone: "blue" as const, date: "6월 4일" },
  { name: "야외 숙영 기본지침", version: "v2.4", type: "PDF", field: "숙영", state: "검수 필요", tone: "amber" as const, date: "6월 2일" },
];

const trainingFields = [
  "전체 분야",
  "전투부상자처치 / 응급처치",
  "핵 및 화생방",
  "각개전투",
  "사격",
  "수류탄 훈련",
  "행군",
  "제식훈련",
  "경계 / 감시 관련 교육",
  "개인화기 및 장비 사용 교육",
  "정신전력교육 / 안보교육",
  "체력단련",
  "야간훈련",
  "숙영",
  "종합전술훈련",
];

type SubItem = { label: string; value: string };
type SectionRow = { label: string; value?: string; subItems?: SubItem[] };
type ReviewSection = { title: string; shortTitle: string; source: string; sourceHeading: string; sourceText: string[]; rows: SectionRow[] };

type ProblemRole = { role: string; action: string };
type ProblemScenario = { label: string; description: string };
type GeneratedQuestion = {
  situation: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};
type ProblemSection = {
  no: number;
  title: string;
  type: string;
  situationVideo: string;
  situationEval: string;
  objective: string;
  roles: ProblemRole[];
  scenarios: ProblemScenario[];
  evalCriteria: string[];
  generatedQuestion: GeneratedQuestion;
};

const problemSections: ProblemSection[] = [
  {
    no: 1,
    title: "분대원 방독면 미착용 상태에서 경보 수신 시 대응",
    type: "개인",
    situationVideo: "훈련 중 분대원이 방독면을 착용하지 않은 상태에서 화생방 경보가 발령된다. 분대원은 당황한 표정으로 주변을 살핀 후 장구류 가방을 열고 방독면을 꺼내 착용한다. 이어 오른손을 들어 인접 인원에게 경보를 전파하고, 분대장 방향으로 뛰어가 상황을 보고하는 동작을 취한다. 배경은 야외 훈련장이며 연기와 경보음이 함께 연출된다.",
    situationEval: "화생방 경보가 발령된 상황에서 방독면 미착용 분대원이 취해야 할 행동 절차와 우선순위를 묻는 평가 상황. 경보 인지 → 개인 보호 → 전파 → 보고 순서의 이해도와 각 단계의 기준 시간 준수 여부를 평가한다.",
    objective: "경보 수신 즉시 방독면 착용 및 인접 인원 경보 전파를 30초 이내에 수행할 수 있다.",
    roles: [
      { role: "당사자 분대원", action: "방독면 즉시 착용 → 주변 인원에게 경보 전파 → 분대장에게 상황 보고" },
      { role: "인접 분대원", action: "경보 수신 확인 후 자신의 보호 장비 착용 상태 점검 → 이상 없을 시 대기" },
      { role: "분대장", action: "전체 분대원 보호 장비 착용 상태 확인 → 미착용자 식별 및 시정 조치 → 상황 보고" },
    ],
    scenarios: [
      { label: "시나리오 A", description: "분대원이 즉시 방독면을 착용하고 경보를 전파하는 정상 대응 시나리오" },
      { label: "시나리오 B", description: "분대원이 패닉 상태로 방독면 착용을 지연하며 주변의 도움이 필요한 시나리오" },
    ],
    evalCriteria: ["경보 수신 후 30초 이내 방독면 착용 완료", "인접 2인 이상에게 경보 전파 수행", "분대장에게 상황 보고 형식 준수"],
    generatedQuestion: {
      situation: "훈련 중 방독면을 미착용한 상태에서 화생방 경보가 발령되었다. 당신은 현재 방독면 가방을 소지하고 있다.",
      question: "이 상황에서 가장 먼저 취해야 할 행동은 무엇인가?",
      options: [
        "즉시 인접 분대원에게 경보를 전파한다.",
        "방독면을 착용한 후 인접 인원에게 경보를 전파한다.",
        "분대장에게 달려가 상황을 보고한다.",
        "오염 의심 지역에서 벗어난 후 방독면을 착용한다.",
      ],
      correctIndex: 1,
      explanation: "개인 보호가 최우선입니다. 방독면 착용 완료 후 인접 인원에게 경보를 전파하고, 분대장에게 보고하는 순서를 준수해야 합니다.",
    },
  },
  {
    no: 2,
    title: "오염 의심지역 진입 전 장비 점검 누락 상황",
    type: "분대",
    situationVideo: "분대가 오염 경계선 앞에 집결한 상황. 분대장이 진입 명령을 하달하지만 장비 점검 지시 없이 분대원들이 이동을 시작하려 한다. 부분대장이 이를 인지하고 분대장에게 보고하며 이동이 일시 중단된다. 분대원들이 줄을 서서 상호 장비 점검을 실시하는 장면과 점검 완료 후 정렬하여 진입하는 장면이 이어진다.",
    situationEval: "오염 의심지역 진입 전 장비 점검 절차의 순서와 각 인원의 역할을 평가하는 상황. 점검 항목(방독면 기밀성, 보호의 밀폐 여부, 장갑·장화 착용)과 누락 발견 시 보고 체계를 올바르게 이해하는지를 확인한다.",
    objective: "오염 의심지역 진입 전 필수 장비 점검 절차를 완전히 수행하고, 누락 발생 시 즉시 시정할 수 있다.",
    roles: [
      { role: "분대장", action: "장비 점검 명령 하달 → 점검 누락 발견 시 이동 중단 명령 → 전 인원 재점검 실시" },
      { role: "부분대장", action: "분대원 장비 상태 확인 → 이상 발견 시 분대장 보고 → 점검 재실시 감독" },
      { role: "개인 분대원 (1~4번)", action: "자신의 보호 장비 점검 → 이상 발견 시 부분대장 보고 → 시정 후 재보고" },
      { role: "후미 감시 분대원", action: "후방 위협 감시 유지 → 장비 점검 완료 시까지 경계 지속" },
    ],
    scenarios: [
      { label: "시나리오 A", description: "점검 누락이 이동 직전 부분대장에 의해 발견되어 즉각 시정하는 시나리오" },
      { label: "시나리오 B", description: "분대원 1명이 장비 이상을 인지하지 못한 채 진입 후 오염 의심 증상 발생" },
      { label: "시나리오 C", description: "분대장이 점검 절차를 의도적으로 생략하고 신속 진입을 강행하는 상황" },
    ],
    evalCriteria: ["진입 전 전 인원 장비 점검 완료 여부", "누락 발생 시 이동 중단 및 재점검 수행", "보고 체계 유지 (개인 → 부분대장 → 분대장)"],
    generatedQuestion: {
      situation: "분대가 오염 의심지역 진입 명령을 받았다. 분대장이 점검 지시 없이 이동을 시작하려 하고 있다. 당신은 부분대장으로서 방독면 기밀성 불량인 분대원을 발견했다.",
      question: "이 상황에서 부분대장이 취해야 할 올바른 조치 순서는?",
      options: [
        "장비 이상 분대원만 남겨두고 나머지는 진입을 계속한다.",
        "분대장에게 이동 중단을 건의하고, 전 인원 장비 재점검을 실시한다.",
        "이상 분대원의 방독면을 빠르게 교체하고 이동을 재개한다.",
        "상급 부대에 즉시 보고한 뒤 분대장 지시를 기다린다.",
      ],
      correctIndex: 1,
      explanation: "장비 이상 발견 시 전체 이동을 중단하고 전 인원 재점검이 원칙입니다. 개인 단위 조치로 넘어가면 다른 인원의 장비 이상을 놓칠 수 있습니다.",
    },
  },
  {
    no: 3,
    title: "분대원 1명 오염 노출 후 제독 절차 미이행",
    type: "개인",
    situationVideo: "분대 이동 중 분대원 1명이 오염 물질 표시 구역을 통과한 직후 보호복에 오염 표식이 부착되는 장면. 분대원은 당황하여 그 자리에 멈추고, 주변 분대원들이 거리를 두며 분대장에게 신호를 보낸다. 분대장이 즉각 격리 지점을 지정하고 제독 담당자가 키트를 꺼내 절차를 수행한다. 동시에 다른 분대원이 의무 요원 호출을 준비하는 장면으로 마무리된다.",
    situationEval: "오염 노출 분대원 발생 시 즉각 취해야 할 격리·제독·보고 절차의 우선순위와 각 역할(노출자, 제독 담당, 분대장)의 임무를 올바르게 이해하는지를 평가한다. 제독 절차의 단계별 내용과 의무 지원 요청 기준을 확인한다.",
    objective: "오염 노출 시 표준 제독 절차를 신속히 수행하고 의무 지원을 요청할 수 있다.",
    roles: [
      { role: "노출 당사자", action: "오염 노출 인지 즉시 격리 지점 이동 → 제독 절차 수행 요청 → 의무 지원 대기" },
      { role: "제독 담당 분대원", action: "노출자 격리 확인 → 현장 제독 키트 사용 제독 수행 → 제독 완료 분대장 보고" },
      { role: "분대장", action: "노출자 격리 구역 설정 → 의무 지원 요청 → 잔여 분대원 안전 확보" },
    ],
    scenarios: [
      { label: "시나리오 A", description: "분대원이 즉시 이상을 보고하고 제독 담당이 표준 절차로 신속히 처리하는 시나리오" },
      { label: "시나리오 B", description: "노출 당사자가 증상을 숨기고 활동을 지속하다 악화되는 시나리오" },
    ],
    evalCriteria: ["오염 노출 인지 즉시 보고 수행", "5분 이내 현장 제독 절차 시작", "의무 지원 요청 및 격리 구역 설정 완료"],
    generatedQuestion: {
      situation: "이동 중 분대원 1명의 보호복에 오염 표식이 부착됐다. 해당 분대원은 당황하여 그 자리에서 보호복을 벗으려 한다.",
      question: "분대장으로서 즉각 내려야 할 첫 번째 지시는?",
      options: [
        "보호복을 벗지 말고 즉시 격리 지점으로 이동하도록 명령한다.",
        "현장에서 바로 보호복을 벗고 오염된 피부를 물로 씻도록 한다.",
        "전 분대원을 해당 위치에 집결시킨 후 상황을 파악한다.",
        "먼저 의무 요원을 호출한 뒤 분대원의 행동을 관찰한다.",
      ],
      correctIndex: 0,
      explanation: "오염 노출 시 보호복 임의 탈의는 2차 오염을 일으킵니다. 격리 지점 이동 후 제독 절차를 수행해야 하며, 현장 탈의는 금지됩니다.",
    },
  },
  {
    no: 4,
    title: "경보 전파 실패로 인접 분대 미대응 상황",
    type: "분대",
    situationVideo: "화생방 경보가 발령된 직후 통신 장비 고장으로 인접 분대와 교신이 끊기는 장면. 분대장이 무전기를 점검하고 고장을 확인한 후 전파 요원을 지정한다. 전파 요원이 규정된 수신호(팔을 교차 후 방향 지시)를 사용해 인접 분대 방향으로 이동하고, 인접 분대원이 신호를 인지하여 보호 장비를 착용하는 장면까지 연결된다. 전 과정은 실시간 시각 효과와 함께 타임라인 형태로 연출된다.",
    situationEval: "통신 두절 상황에서 대체 경보 전파 수단(육성·수신호)의 규격과 사용 조건을 이해하는지 평가한다. 전파 요원 지정 절차, 수신호 의미 및 사용 범위, 인접 분대의 수신 확인 방법에 대한 이해도를 확인한다.",
    objective: "통신 두절 상황에서 육성 및 수신호를 활용하여 인접 분대에 경보를 전파하고 협조 체계를 유지할 수 있다.",
    roles: [
      { role: "경보 수신 분대장", action: "통신 두절 확인 → 육성·수신호 전파 요원 지정 → 인접 분대 확인 및 경보 전달" },
      { role: "전파 요원", action: "인접 분대 위치 확인 → 육성 및 수신호로 경보 전파 → 전파 완료 분대장 보고" },
      { role: "인접 분대 대응 요원", action: "수신 신호 식별 → 자 분대장 보고 → 보호 장비 착용 지시에 따라 행동" },
      { role: "통신 담당 분대원", action: "통신 장비 복구 시도 → 복구 불가 시 대체 수단 분대장 보고 → 복구 완료 후 정상 복귀" },
      { role: "분대장 (인접 분대)", action: "전파된 경보 인지 → 분대 보호 장비 착용 명령 → 상황 보고 체계 유지" },
    ],
    scenarios: [
      { label: "시나리오 A", description: "통신 두절 후 수신호로 인접 분대에 신속히 경보를 전파하는 정상 대응 시나리오" },
      { label: "시나리오 B", description: "수신호 식별 실패로 인접 분대가 경보를 늦게 인지하는 시나리오" },
      { label: "시나리오 C", description: "전파 요원이 이동 중 노출 구역을 통과하게 되는 위험 상황 시나리오" },
      { label: "시나리오 D", description: "다수 인접 분대에 동시 전파가 필요한 복합 상황 시나리오" },
    ],
    evalCriteria: ["통신 두절 후 2분 이내 대체 전파 수단 선택", "육성·수신호 경보 전파 규격 준수", "인접 분대 경보 수신 확인 완료", "보고 체계 유지 및 상황 기록"],
    generatedQuestion: {
      situation: "화생방 경보 발령 직후 무전기 고장으로 인접 분대와 통신이 두절됐다. 인접 분대는 약 50m 전방에 위치하고 있으며, 육안으로 식별 가능하다.",
      question: "규정에 따른 대체 경보 전파 방법으로 올바른 것은?",
      options: [
        "신속히 뛰어가 직접 인접 분대장에게 말로 전달한다.",
        "규정된 수신호(팔 교차 후 방향 지시)를 사용하여 경보를 전파한다.",
        "총기를 공중에 발사하여 위험 상황을 알린다.",
        "인접 분대가 스스로 상황을 인지할 때까지 현 위치를 유지한다.",
      ],
      correctIndex: 1,
      explanation: "통신 두절 시 규정된 수신호를 사용합니다. 무단 이동은 오염 구역 진입 위험이 있으며, 총기 발사는 우발 상황을 유발합니다.",
    },
  },
  {
    no: 5,
    title: "분대장 부재 시 부분대장 지휘 전환 절차",
    type: "분대",
    situationVideo: "오염 대응 작전 중 분대장이 오염 노출로 이탈하는 장면. 분대장이 부분대장에게 현재 임무와 분대원 현황을 간략히 인계하고 격리 지점으로 이동한다. 부분대장이 전면에 나서 분대원들에게 상황을 공유하고 지휘 인수를 선언하는 동작을 취한다. 분대원들이 새 지휘체계 하에 임무를 지속하는 장면과 상급 부대에 상황 보고를 준비하는 장면으로 이어진다.",
    situationEval: "분대장 부재 상황에서 지휘권 인수 절차와 임무 연속성 유지 방법을 평가한다. 지휘 인수 선언의 형식, 상급 부대 보고 시한, 분대원 심리 안정 조치, 인계 내용(임무·현황·위협 정보)의 필수 항목 등을 올바르게 이해하는지를 확인한다.",
    objective: "분대장 부재 시 부분대장이 표준 절차에 따라 지휘권을 인수하고 분대 임무를 지속할 수 있다.",
    roles: [
      { role: "부분대장", action: "분대장 이탈 상황 인지 → 지휘권 인수 선언 → 분대원에게 상황 공유 및 계속 임무 수행 지시" },
      { role: "분대원 (전체)", action: "부분대장 지휘권 인수 인지 → 기존 임무 지속 → 새 명령 대기" },
      { role: "이탈 분대장", action: "부분대장에게 상황 및 임무 인계 → 의무 지원 요청 → 지시에 따라 격리 지점 이동" },
      { role: "상급 부대 연락 담당", action: "분대장 이탈 상황 상급 부대 보고 → 지원 요청 → 부분대장 지원 보고 지속" },
    ],
    scenarios: [
      { label: "시나리오 A", description: "분대장이 이탈 전 임무를 완전히 인계하고 부분대장이 원활히 지휘권을 이어받는 시나리오" },
      { label: "시나리오 B", description: "분대장이 갑작스럽게 이탈하여 인계 절차 없이 부분대장이 독자 판단으로 대응하는 시나리오" },
      { label: "시나리오 C", description: "지휘권 인수 과정에서 분대원 간 혼선이 발생하는 시나리오" },
    ],
    evalCriteria: ["지휘권 인수 선언 즉시 수행 (1분 이내)", "상급 부대 보고 5분 이내 완료", "임무 연속성 유지 (임무 중단 없이 지속)", "분대원 심리적 안정 유지 조치 수행"],
    generatedQuestion: {
      situation: "오염 대응 작전 중 분대장이 오염 노출로 이탈했다. 분대원들은 혼란스러워하고 있으며, 진행 중인 임무는 아직 완료되지 않았다.",
      question: "부분대장으로서 가장 먼저 수행해야 할 행동은?",
      options: [
        "분대원들에게 현 위치를 유지하도록 하고 상급 부대 보고를 먼저 실시한다.",
        "분대원들에게 지휘권 인수를 선언하고 현재 임무를 지속하도록 지시한다.",
        "분대장을 따라가 임무 인계를 받은 뒤 복귀한다.",
        "분대원들과 협의하여 임무 중단 여부를 결정한다.",
      ],
      correctIndex: 1,
      explanation: "지휘권 인수 선언이 최우선입니다. 임무 연속성을 유지하면서 상급 부대 보고(5분 이내)를 이어서 수행해야 합니다.",
    },
  },
];

const reviewSections: ReviewSection[] = [
    {
      title: "교육 목표 및 핵심 개념",
      shortTitle: "목표·개념",
      source: "원본 1–3쪽",
      sourceHeading: "1. 교육 목적 및 기본 개념",
      sourceText: [
        "상황 발생 시 위협을 정확히 식별하고 개인 및 분대 단위로 필요한 행동을 수행할 수 있도록 교육한다.",
        "모든 인원은 경보를 인지한 즉시 개인 보호 조치를 실시하고 상황을 분대장에게 보고하여야 한다.",
      ],
      rows: [
        {
          label: "교육 목표",
          subItems: [
            { label: "훈련 목적", value: "화생방 위협 상황에서 개인 및 분대 단위의 생존 능력과 임무 수행 능력을 배양한다." },
            { label: "달성 기준", value: "위협 식별 후 30초 이내 개인 보호 장비를 착용하고 인접 인원에게 경보를 전파할 수 있다." },
            { label: "적용 범위", value: "분대 단위 이하 전 인원. 분대장 및 부분대장은 추가 지휘 통제 역할을 포함한다." },
          ],
        },
        {
          label: "핵심 개념",
          subItems: [
            { label: "개인 보호", value: "방독면 및 보호의 착용 절차를 숙지하고 경보 즉시 자기 보호 조치를 우선 실시한다." },
            { label: "경보 전파", value: "육성 및 수신호를 활용하여 인접 인원에게 위협 종류와 위치를 신속히 전파한다." },
            { label: "오염 통제", value: "오염 의심 구역을 명확히 구분하고 비오염 구역으로의 확산을 차단하는 절차를 이행한다." },
            { label: "상황 보고", value: "위협 식별 시각, 종류, 위치, 피해 현황을 포함한 표준 보고 형식으로 분대장에게 보고한다." },
          ],
        },
      ],
    },
    {
      title: "상황 1: 경보 수신 및 위협 식별",
      shortTitle: "상황 1",
      source: "원본 4–9쪽",
      sourceHeading: "2. 상황 1 – 경보 수신 및 위협 식별",
      sourceText: [
        "경보가 발령되거나 오염 의심 징후가 발견된 경우 즉시 위협의 종류와 위치를 식별한다.",
        "가. 위협 징후를 식별한다. 나. 개인 보호 장비를 즉시 착용한다. 다. 인접 인원에게 경보를 전파한다.",
      ],
      rows: [
        { label: "상황 설명", value: "경보 발령 또는 오염 징후 발견 시 개인 보호 조치를 즉시 수행하는 상황" },
        { label: "행동 및 순서", value: "① 위협 징후 식별 → ② 개인 보호 장비 착용 → ③ 인접 인원에게 경보 전파 → ④ 분대장에게 상황 보고" },
        { label: "금지 행동", value: "보호 장비 착용 전 이동 금지, 경보 미전파 금지" },
        { label: "역할", value: "분대장: 상황 판단 및 임무 분담 / 관측자: 위협 징후 지속 감시 / 전파 담당: 인접 인원 경보 전달" },
      ],
    },
    {
      title: "상황 2: 오염 의심지역 진입",
      shortTitle: "상황 2",
      source: "원본 10–15쪽",
      sourceHeading: "3. 상황 2 – 오염 의심지역 진입",
      sourceText: [
        "오염 의심지역에 진입하거나 분대원의 보호 장비에 이상이 발생한 경우 상황을 보고한다.",
        "지정된 절차에 따라 이동하며 분대장의 통제하에 오염 통제 절차를 수행한다.",
      ],
      rows: [
        { label: "상황 설명", value: "분대가 오염 의심지역에 진입하거나 장비 이상이 발생한 상황" },
        { label: "행동 및 순서", value: "① 진입 전 장비 점검 → ② 오염 통제선 확인 → ③ 분대장 통제하 이동 → ④ 이상 발생 시 즉시 보고" },
        { label: "금지 행동", value: "분대장 통제 없이 단독 이동 금지, 장비 이상 미보고 금지, 오염 통제선 임의 이탈 금지" },
        { label: "역할", value: "분대장: 진입 통제 및 이동 경로 결정 / 분대원: 상호 장비 상태 확인 / 후미 인원: 통제선 감시" },
      ],
    },
    {
      title: "상황 3: 분대원 오염 노출 대응",
      shortTitle: "상황 3",
      source: "원본 16–22쪽",
      sourceHeading: "4. 상황 3 – 분대원 오염 노출 대응",
      sourceText: [
        "분대원이 오염 물질에 노출된 경우 즉시 제독 절차를 시행하고 의무 지원을 요청한다.",
        "지휘관의 별도 지시 없이 보호 장비를 해제하거나 지정된 지역을 이탈해서는 안 된다.",
      ],
      rows: [
        { label: "상황 설명", value: "분대원이 오염 물질에 직접 노출되어 즉각 대응이 필요한 상황" },
        { label: "행동 및 순서", value: "① 노출 인원 격리 → ② 현장 제독 절차 시행 → ③ 의무 지원 요청 → ④ 지휘관에게 상황 보고" },
        { label: "금지 행동", value: "지휘관 지시 없는 보호 장비 해제 금지, 미승인 지역 이탈 금지, 노출 인원 방치 금지" },
        { label: "역할", value: "분대장: 격리 구역 설정 및 지원 요청 / 제독 담당: 현장 제독 절차 수행 / 분대원: 노출 인원 지원" },
      ],
    },
];


function ProblemReviewPage({ document, initialCompleted = 0, initialSection = 0, onBack, onApprove, onSaveDraft }: { document: (typeof documents)[number]; initialCompleted?: number; initialSection?: number; onBack: () => void; onApprove: () => void; onSaveDraft?: (completed: number, current: number) => void }) {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);
  const [openAnalysisIndex, setOpenAnalysisIndex] = useState<number | null>(null);
  const [completedSections, setCompletedSections] = useState<number[]>(
    Array.from({ length: initialCompleted }, (_, i) => i)
  );

  const sections = problemSections;
  const section = sections[currentSection];

  const completeAndContinue = () => {
    const newCompleted = completedSections.includes(currentSection) ? completedSections : [...completedSections, currentSection];
    setCompletedSections(newCompleted);
    if (currentSection < sections.length - 1) {
      setCurrentSection((c) => c + 1);
    } else {
      onApprove();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-5 py-5 md:px-8">
        <div
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={(event) => event.key === "Enter" && onBack()}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <Icon name="chevron" className="size-4 rotate-180" />교범 관리로 돌아가기
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2"><Badge tone="purple">문제 검수</Badge><span className="text-xs font-semibold text-slate-400">{document.field}</span></div>
            <div className="text-2xl font-black">{document.name}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-500">{currentSection + 1} / {sections.length}</span>
            <Button variant="secondary" onClick={() => onSaveDraft?.(completedSections.length, currentSection)}>검수 임시 저장</Button>
          </div>
        </div>
      </div>


      <div className="border-b border-slate-200 bg-white px-5 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
<div className="mt-1 text-sm font-extrabold text-slate-800">문제 {section.no} · {section.title}</div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold transition-opacity ${section.type === "개인" ? "bg-blue-50 text-blue-700 opacity-100" : "bg-blue-50 text-blue-700 opacity-25"}`}>개인 단위</span>
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold transition-opacity ${section.type === "분대" ? "bg-violet-50 text-violet-700 opacity-100" : "bg-violet-50 text-violet-700 opacity-25"}`}>분대 단위</span>
              </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1 overflow-hidden rounded-xl bg-slate-900 shadow-lg" style={{ aspectRatio: "16/9" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                  <svg className="size-7 translate-x-0.5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-white">상황 설명 영상</div>
                  <div className="mt-1 text-xs text-white/50">AI 생성 · {section.type} 훈련 시나리오</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-8">
                <div className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
                  <svg className="size-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="h-1 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-0 rounded-full bg-white"></div>
                  </div>
                </div>
                <span className="text-xs font-semibold tabular-nums text-white/70">0:00 / 2:34</span>
                <div className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:w-56">
              <div className="text-xs font-bold text-slate-400">문제별 영상</div>
              {problemSections.map((ps) => {
                const isCurrent = ps.no === section.no;
                return (
                  <div
                    key={ps.no}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentSection(ps.no - 1)}
                    onKeyDown={(e) => e.key === "Enter" && setCurrentSection(ps.no - 1)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${isCurrent ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-md ${isCurrent ? "bg-white/15" : "bg-slate-100"}`}>
                      {completedSections.includes(ps.no - 1)
                        ? <Icon name="check" className={`size-4 ${isCurrent ? "text-emerald-300" : "text-emerald-600"}`} />
                        : <svg className={`size-4 translate-x-0.5 ${isCurrent ? "text-white" : "text-slate-500"}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-xs font-bold ${isCurrent ? "text-white" : "text-slate-700"}`}>문제 {ps.no}</div>
                      <div className={`truncate text-[10px] ${isCurrent ? "text-white/60" : "text-slate-400"}`}>{ps.type} · 2:34</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col xl:flex-row">
        <section className="min-w-0 flex-1 bg-white p-5 md:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest text-slate-400">AI 생성 문제 · {currentSection + 1}/{sections.length}</div>
                <div className="mt-2 text-2xl font-black">{section.title}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={section.type === "개인" ? "blue" : "purple"}>{section.type} 단위</Badge>
                {!isAnalysisOpen && <Button variant="secondary" onClick={() => setIsAnalysisOpen(true)}>분석 보기</Button>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">1</span>
                  <span className="text-sm font-extrabold">상황 설명</span>
                </div>
                <div className="space-y-2">
                  <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                      <span className="flex size-5 items-center justify-center rounded bg-violet-100 text-[10px] font-black text-violet-600">영</span>
                      <span className="text-xs font-bold text-slate-600">영상 생성용 상세 시나리오</span>
                    </div>
                    <div
                      role="textbox"
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-16 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                    >
                      {section.situationVideo}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                      <span className="flex size-5 items-center justify-center rounded bg-blue-100 text-[10px] font-black text-blue-600">평</span>
                      <span className="text-xs font-bold text-slate-600">개념 및 교본 내용 이해 평가용</span>
                    </div>
                    <div
                      role="textbox"
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-16 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                    >
                      {section.situationEval}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">2</span>
                  <span className="text-sm font-extrabold">훈련 목표</span>
                </div>
                <div
                  role="textbox"
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-10 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-slate-300 focus:bg-white focus:ring-1"
                >
                  {section.objective}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 p-5">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-900 text-xs font-black text-white">3</span>
                  <span className="text-sm font-extrabold">생성된 문제 (예비군 표시용)</span>
                </div>
                <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="mb-1 text-[10px] font-bold tracking-widest text-slate-400">상황</div>
                    <p className="text-sm font-medium leading-relaxed text-slate-700">{section.generatedQuestion.situation}</p>
                  </div>
                  <div className="px-5 py-4">
                    <div className="mb-3 text-sm font-extrabold text-slate-900">{section.generatedQuestion.question}</div>
                    <div className="space-y-2">
                      {section.generatedQuestion.options.map((option, i) => (
                        <div key={i} className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${i === section.generatedQuestion.correctIndex ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
                          <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${i === section.generatedQuestion.correctIndex ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={`text-sm leading-relaxed ${i === section.generatedQuestion.correctIndex ? "font-semibold text-emerald-800" : "font-medium text-slate-700"}`}>{option}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                      <div className="mb-1 text-[10px] font-bold tracking-widest text-blue-500">해설</div>
                      <p className="text-xs font-medium leading-relaxed text-blue-800">{section.generatedQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">4</span>
                  <span className="text-sm font-extrabold">역할군 및 행동 답안</span>
                  <Badge tone="neutral">{section.roles.length}개 역할</Badge>
                </div>
                <div className="space-y-2">
                  {section.roles.map((role, i) => (
                    <div key={role.role} className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                        <span className="flex size-5 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">{i + 1}</span>
                        <span className="text-xs font-bold text-slate-600">{role.role}</span>
                      </div>
                      <div
                        role="textbox"
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-10 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                      >
                        {role.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">5</span>
                  <span className="text-sm font-extrabold">시나리오</span>
                  <Badge tone="neutral">{section.scenarios.length}개</Badge>
                </div>
                <div className="space-y-2">
                  {section.scenarios.map((scenario, i) => (
                    <div key={scenario.label} className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                        <span className="flex size-5 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">{i + 1}</span>
                        <span className="text-xs font-bold text-slate-600">{scenario.label}</span>
                      </div>
                      <div
                        role="textbox"
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-10 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                      >
                        {scenario.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">6</span>
                  <span className="text-sm font-extrabold">평가 기준</span>
                </div>
                <div className="space-y-2">
                  {section.evalCriteria.map((criterion, i) => (
                    <div key={criterion} className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">{i + 1}</span>
                      <div
                        role="textbox"
                        contentEditable
                        suppressContentEditableWarning
                        className="flex-1 text-sm font-medium leading-relaxed text-slate-700 outline-none focus:bg-white"
                      >
                        {criterion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <Button variant="secondary" onClick={() => currentSection > 0 && setCurrentSection((c) => c - 1)}>이전 문제</Button>
              <Button icon="check" onClick={completeAndContinue}>
                {currentSection === sections.length - 1 ? "검수 완료" : "이 문제 승인 후 다음"}
              </Button>
            </div>
          </div>
        </section>

        {isAnalysisOpen && (
          <aside className="sticky top-0 h-screen w-full shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-100 p-5 xl:w-2/5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-extrabold">AI 분석 결과</div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsAnalysisOpen(false)}
                onKeyDown={(event) => event.key === "Enter" && setIsAnalysisOpen(false)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>
            <div className="space-y-2">
              {reviewSections.map((sec, index) => {
                const isOpen = openAnalysisIndex === index;
                return (
                  <div key={sec.title} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setOpenAnalysisIndex(isOpen ? null : index)}
                      onKeyDown={(e) => e.key === "Enter" && setOpenAnalysisIndex(isOpen ? null : index)}
                      className="flex cursor-pointer items-center gap-2.5 px-4 py-3"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">{index + 1}</span>
                      <div className="min-w-0 flex-1 text-xs font-extrabold text-slate-800">{sec.title}</div>
                      <Icon name="chevron" className={`size-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`} />
                    </div>
                    {isOpen && (
                      <div className="space-y-2 border-t border-slate-100 px-3 py-3">
                        {sec.rows.map((row) => (
                          <div key={row.label} className="overflow-hidden rounded-lg border border-slate-100">
                            <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
                              <span className="text-xs font-bold text-slate-500">{row.label}</span>
                            </div>
                            {row.subItems ? (
                              <div className="divide-y divide-slate-100">
                                {row.subItems.map((sub, subIndex) => (
                                  <div key={sub.label} className="grid gap-2 px-3 py-2.5 sm:grid-cols-[7rem_1fr] sm:gap-3">
                                    <div className="flex items-center gap-1.5">
                                      <span className="flex size-4 shrink-0 items-center justify-center rounded bg-slate-200 text-[9px] font-black text-slate-500">{subIndex + 1}</span>
                                      <span className="text-xs font-semibold text-slate-500">{sub.label}</span>
                                    </div>
                                    <span className="text-xs font-medium leading-relaxed text-slate-700">{sub.value}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="px-3 py-2.5">
                                <span className="text-xs font-medium leading-relaxed text-slate-700">{row.value}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-violet-700">문제 생성 근거</span>
                </div>
                <p className="text-xs leading-relaxed text-violet-800">
                  위 분석 결과를 바탕으로 교육 목표 달성 여부를 평가할 수 있는 {problemSections.length}개의 실전 상황 문제가 생성되었습니다. 개인 단위 {problemSections.filter(p => p.type === "개인").length}개, 분대 단위 {problemSections.filter(p => p.type === "분대").length}개로 구성됩니다.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function ProblemPreviewPage({ document, onBack, onStartReview }: { document: (typeof documents)[number]; onBack: () => void; onStartReview: () => void }) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-5 py-5 md:px-8">
        <div
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={(e) => e.key === "Enter" && onBack()}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <Icon name="chevron" className="size-4 rotate-180" />교범 관리로 돌아가기
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="purple">문제 검수 필요</Badge>
              <span className="text-xs font-semibold text-slate-400">{document.field}</span>
            </div>
            <div className="text-2xl font-black">{document.name}</div>
          </div>
          <div className="flex items-center gap-3">
            {!isAnalysisOpen && (
              <Button variant="secondary" onClick={() => setIsAnalysisOpen(true)}>분석 보기</Button>
            )}
            <Button icon="check" onClick={onStartReview}>문제 검수하기</Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)] flex-col xl:flex-row">
        <section className="min-w-0 flex-1 bg-white p-5 md:p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <div className="mb-4 text-lg font-extrabold">기본 정보</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "훈련 분야", value: document.field },
                  { label: "최근 수정", value: document.date },
                  { label: "등록자", value: "김관리" },
                  { label: "파일 형식", value: document.type },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">{item.label}</div>
                    <div className="mt-2 text-sm font-bold text-slate-700">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-lg font-extrabold">교범 설명</div>
              <div className="min-h-20 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                오염지역에서 분대원이 수행해야 하는 역할과 행동 절차, 정보 공유 방법 및 금지 행동을 정리한 교육 지침입니다.
              </div>
            </div>

            <div>
              <div className="mb-3 text-lg font-extrabold">생성된 문제 목록</div>
              <div className="space-y-2">
                {problemSections.map((ps) => (
                  <div key={ps.no} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">{ps.no}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-800">{ps.title}</div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span>{ps.type} 단위</span>
                        <span>·</span>
                        <span>역할군 {ps.roles.length}개</span>
                        <span>·</span>
                        <span>시나리오 {ps.scenarios.length}개</span>
                      </div>
                    </div>
                    <Badge tone="purple">검수 필요</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-6">
              <Button icon="check" onClick={onStartReview}>문제 검수하기</Button>
            </div>
          </div>
        </section>

        {isAnalysisOpen && (
          <aside className="sticky top-0 h-screen w-full shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-100 p-5 xl:w-2/5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-extrabold">AI 분석 결과</div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsAnalysisOpen(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsAnalysisOpen(false)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>
            <div className="space-y-3">
              {reviewSections.map((sec, secIndex) => (
                <div key={sec.title} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">{secIndex + 1}</span>
                    <div className="text-xs font-extrabold text-slate-800">{sec.title}</div>
                  </div>
                  <div className="space-y-2 px-3 py-3">
                    {sec.rows.map((row) => (
                      <div key={row.label} className="overflow-hidden rounded-lg border border-slate-100">
                        <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
                          <span className="text-xs font-bold text-slate-500">{row.label}</span>
                        </div>
                        {row.subItems ? (
                          <div className="divide-y divide-slate-100">
                            {row.subItems.map((sub, subIndex) => (
                              <div key={sub.label} className="grid gap-2 px-3 py-2.5 sm:grid-cols-[7rem_1fr] sm:gap-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="flex size-4 shrink-0 items-center justify-center rounded bg-slate-200 text-[9px] font-black text-slate-500">{subIndex + 1}</span>
                                  <span className="text-xs font-semibold text-slate-500">{sub.label}</span>
                                </div>
                                <span className="text-xs font-medium leading-relaxed text-slate-700">{sub.value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-3 py-2.5">
                            <span className="text-xs font-medium leading-relaxed text-slate-700">{row.value}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function ReviewPage({ document, initialCompleted = 0, initialSection = 0, onBack, onApprove, onProgress, onSaveDraft }: { document: (typeof documents)[number]; initialCompleted?: number; initialSection?: number; onBack: () => void; onApprove: () => void; onProgress?: (completed: number, total: number) => void; onSaveDraft?: (completed: number, current: number) => void }) {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [isSourceOpen, setIsSourceOpen] = useState(true);
  const [completedSections, setCompletedSections] = useState<number[]>(
    Array.from({ length: initialCompleted }, (_, i) => i)
  );

  const sections = reviewSections;
  const section = sections[currentSection];
  const completeAndContinue = () => {
    const newCompleted = completedSections.includes(currentSection) ? completedSections : [...completedSections, currentSection];
    setCompletedSections(newCompleted);
    onProgress?.(newCompleted.length, sections.length);
    if (currentSection < sections.length - 1) {
      setCurrentSection((current) => current + 1);
    } else {
      onApprove();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-5 py-5 md:px-8">
        <div
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={(event) => event.key === "Enter" && onBack()}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <Icon name="chevron" className="size-4 rotate-180" />교범 관리로 돌아가기
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2"><Badge tone="amber">상세 검수</Badge><span className="text-xs font-semibold text-slate-400">{document.field}</span></div>
            <div className="text-2xl font-black">{document.name}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-500">{currentSection + 1} / {sections.length}</span>
            <Button variant="secondary" onClick={() => onSaveDraft?.(completedSections.length, currentSection)}>검수 임시 저장</Button>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-5 md:px-8">
        <div className="flex overflow-x-auto">
          {sections.map((item, index) => {
            const isCompleted = completedSections.includes(index);
            const isCurrent = currentSection === index;
            return (
              <div
                key={item.title}
                role="button"
                tabIndex={0}
                onClick={() => (isCompleted || index <= currentSection) && setCurrentSection(index)}
                className={`flex min-w-40 items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold ${isCurrent ? "border-slate-900 text-slate-900" : isCompleted ? "cursor-pointer border-transparent text-emerald-700" : "cursor-not-allowed border-transparent text-slate-300"}`}
              >
                <span className={`flex size-6 items-center justify-center rounded-full text-xs ${isCompleted ? "bg-emerald-100 text-emerald-700" : isCurrent ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {isCompleted ? <Icon name="check" className="size-3.5" /> : index + 1}
                </span>
                {item.shortTitle}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-screen flex-col xl:flex-row">
        <section className="min-w-0 flex-1 bg-white p-5 md:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest text-slate-400">AI 생성 내용 · 목차 {currentSection + 1}</div>
                <div className="mt-2 text-2xl font-black">{section.title}</div>
              </div>
              {!isSourceOpen && <Button variant="secondary" icon="book" onClick={() => setIsSourceOpen(true)}>원본 보기</Button>}
            </div>

            <div className="space-y-4">
              {section.rows.map((row, index) => (
                <div key={row.label} className="rounded-xl border border-slate-200 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">{index + 1}</span>
                      <span className="text-sm font-extrabold">{row.label}</span>
                    </div>
                    <Badge tone="blue">{section.source}</Badge>
                  </div>
                  {row.subItems ? (
                    <div className="space-y-2">
                      {row.subItems.map((sub, subIndex) => (
                        <div key={sub.label} className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                          <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                            <span className="flex size-5 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">{subIndex + 1}</span>
                            <span className="text-xs font-bold text-slate-600">{sub.label}</span>
                          </div>
                          <div
                            role="textbox"
                            contentEditable
                            suppressContentEditableWarning
                            className="min-h-10 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                          >
                            {sub.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div role="textbox" contentEditable suppressContentEditableWarning className="min-h-16 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-slate-300 focus:bg-white focus:ring-1">
                      {row.value}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <Button variant="secondary" onClick={() => currentSection > 0 && setCurrentSection((current) => current - 1)}>이전 목차</Button>
              <Button icon="check" onClick={completeAndContinue}>
                {currentSection === sections.length - 1 ? "검수 완료" : "이 목차 승인 후 다음"}
              </Button>
            </div>
          </div>
        </section>

        {isSourceOpen && (
          <aside className="w-full shrink-0 border-l border-slate-200 bg-slate-100 p-5 xl:w-2/5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-base font-extrabold">실제 원본 데이터</div>
                <div className="mt-1 text-xs text-slate-500">{section.source} · {document.name}.pdf</div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsSourceOpen(false)}
                onKeyDown={(event) => event.key === "Enter" && setIsSourceOpen(false)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>
            <div className="rounded-xl bg-slate-700 p-5 shadow-inner">
              <div className="mx-auto min-h-screen max-w-xl bg-white p-8 shadow-xl">
                <div className="border-b-2 border-slate-900 pb-5">
                  <div className="text-xs font-bold tracking-widest text-slate-500">교육훈련 교범</div>
                  <div className="mt-3 text-xl font-black">{document.field} 기본훈련</div>
                </div>
                <div className="mt-8">
                  <div className="text-lg font-extrabold">{section.sourceHeading}</div>
                  <div className="mt-5 space-y-5 text-sm leading-loose text-slate-700">
                    {section.sourceText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
                <div className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">{section.source}</div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("교범 관리");
  const [pageMode, setPageMode] = useState<"list" | "register" | "review" | "problem-preview" | "problem-review">("list");
  const [reviewPageDocument, setReviewPageDocument] = useState<(typeof documents)[number] | null>(null);
  const [scope, setScope] = useState<"전체" | "임시 저장" | "추출 중" | "검수 필요" | "검수 완료" | "문제 생성 중" | "문제 검수 필요" | "문제 검수 완료">("전체");
  const [selectedField, setSelectedField] = useState("전체 분야");
  const [isFieldMenuOpen, setIsFieldMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"최신 등록순" | "예전 등록순">("최신 등록순");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [openDocumentMenu, setOpenDocumentMenu] = useState<string | null>(null);
  const [selectedExtractionDocument, setSelectedExtractionDocument] = useState<(typeof documents)[number] | null>(null);
  const [selectedDraftDocument, setSelectedDraftDocument] = useState<(typeof documents)[number] | null>(null);
  const [isDraftEditing, setIsDraftEditing] = useState(false);
  const [selectedReviewDocument, setSelectedReviewDocument] = useState<(typeof documents)[number] | null>(null);
  const [selectedCompletedDocument, setSelectedCompletedDocument] = useState<(typeof documents)[number] | null>(null);
  const [selectedGeneratingDocument, setSelectedGeneratingDocument] = useState<(typeof documents)[number] | null>(null);
  const [selectedProblemReviewDocument, setSelectedProblemReviewDocument] = useState<(typeof documents)[number] | null>(null);
  const [extractingDraftName, setExtractingDraftName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [problemReviewPageDocument, setProblemReviewPageDocument] = useState<(typeof documents)[number] | null>(null);
  const [reviewProgress, setReviewProgress] = useState<Record<string, { completed: number; current: number }>>({});
  const [problemReviewProgress, setProblemReviewProgress] = useState<Record<string, { completed: number; current: number }>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notice, setNotice] = useState("");
  const fieldMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeFieldMenu = (event: PointerEvent) => {
      if (fieldMenuRef.current && !fieldMenuRef.current.contains(event.target as Node)) {
        setIsFieldMenuOpen(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
      if (!(event.target as Element).closest("[data-document-menu]")) {
        setOpenDocumentMenu(null);
      }
    };

    document.addEventListener("pointerdown", closeFieldMenu);
    return () => document.removeEventListener("pointerdown", closeFieldMenu);
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const closeDraftModal = () => {
    setSelectedDraftDocument(null);
    setIsDraftEditing(false);
  };

  const openDetailedReview = (document: (typeof documents)[number]) => {
    setReviewPageDocument(document);
    setSelectedReviewDocument(null);
    setPageMode("review");
  };

  const startDraftExtraction = async (documentName: string) => {
    if (extractingDraftName) return;
    setExtractingDraftName(documentName);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      showNotice(`${documentName} 지식 추출을 시작했습니다.`);
    } finally {
      setExtractingDraftName(null);
    }
  };

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document.name.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase());
    const matchesField = selectedField === "전체 분야" || document.field === selectedField;
    const matchesScope = scope === "전체" || document.state === scope;
    return matchesSearch && matchesField && matchesScope;
  });
  const sortedDocuments = sortOrder === "최신 등록순" ? filteredDocuments : [...filteredDocuments].reverse();
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / pageSize));
  const paginatedDocuments = sortedDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rangeStart = sortedDocuments.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, sortedDocuments.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedField, scope, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-200 lg:flex lg:flex-col ${isSidebarOpen ? "w-64" : "w-16"}`}>
          <div className={`flex h-20 items-center border-b border-slate-100 ${isSidebarOpen ? "gap-3 px-6" : "justify-center px-3"}`}>
            {isSidebarOpen ? (
              <>
                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white"><Icon name="soldier" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-extrabold tracking-tight">TACTIC AI</div>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsSidebarOpen(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsSidebarOpen(false)}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Icon name="chevron" className="size-4 rotate-180" />
                </div>
              </>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsSidebarOpen(true)}
                onKeyDown={(e) => e.key === "Enter" && setIsSidebarOpen(true)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-white"
              >
                <Icon name="soldier" />
              </div>
            )}
          </div>
          <div className="flex-1 px-2 py-6">
            {isSidebarOpen && <div className="mb-3 px-3 text-xs font-bold tracking-widest text-slate-400">관리 메뉴</div>}
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.label} role="button" tabIndex={0} onClick={() => { setActiveNav(item.label); setPageMode("list"); }} onKeyDown={(event) => { if (event.key === "Enter") { setActiveNav(item.label); setPageMode("list"); } }} className={`group flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${isSidebarOpen ? "gap-3" : "justify-center"} ${activeNav === item.label ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <Icon name={item.icon} className="size-5 shrink-0" />
                  {isSidebarOpen && <><span className="flex-1">{item.label}</span>{item.count && <span className={`rounded-md px-2 py-0.5 text-xs ${activeNav === item.label ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"}`}>{item.count}</span>}</>}
                </div>
              ))}
            </div>
            {isSidebarOpen && <div className="mt-8 mb-3 px-3 text-xs font-bold tracking-widest text-slate-400">시스템</div>}
            <div className={`mt-${isSidebarOpen ? "0" : "8"} flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 ${isSidebarOpen ? "gap-3" : "justify-center"}`} title={!isSidebarOpen ? "환경 설정" : undefined}>
              <Icon name="settings" className="size-5 shrink-0" />{isSidebarOpen && <span>환경 설정</span>}
            </div>
          </div>
          <div className={`flex items-center border-t border-slate-100 p-4 ${isSidebarOpen ? "gap-3" : "justify-center"}`}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-extrabold text-slate-700">김</div>
            {isSidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">김관리</div>
                  <div className="truncate text-xs text-slate-400">교육훈련 관리자</div>
                </div>
                <Icon name="more" className="size-5 text-slate-400" />
              </>
            )}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {pageMode === "list" ? (
          <div className="mx-auto max-w-screen-2xl p-5 md:p-8">
            <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="text-3xl font-black tracking-tight">교범 관리</div>
              </div>
              <div className="flex items-center gap-2">
                <Button icon="upload" onClick={() => setPageMode("register")}>교범 등록</Button>
              </div>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
                  <div><span className="text-sm font-semibold text-slate-500">전체 교범</span><span className="ml-2 text-lg font-black">{documents.length}</span></div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div><span className="text-sm font-semibold text-slate-500">분석 중</span><span className="ml-2 text-lg font-black text-blue-700">{documents.filter((d) => d.state === "추출 중").length}</span></div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div><span className="text-sm font-semibold text-slate-500">검수 필요</span><span className="ml-2 text-lg font-black text-amber-700">{documents.filter((d) => d.state === "검수 필요").length}</span></div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div><span className="text-sm font-semibold text-slate-500">문제 생성 중</span><span className="ml-2 text-lg font-black text-blue-700">{documents.filter((d) => d.state === "문제 생성 중").length}</span></div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div><span className="text-sm font-semibold text-slate-500">문제 검수 필요</span><span className="ml-2 text-lg font-black text-violet-700">{documents.filter((d) => d.state === "문제 검수 필요").length}</span></div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex min-w-60 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus-within:border-slate-400">
                    <Icon name="search" className="size-4 shrink-0 text-slate-400" />
                    {!searchQuery && <span className="pointer-events-none absolute left-10 text-slate-400">교범명 검색</span>}
                    <div
                      role="textbox"
                      aria-label="교범명 검색"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(event) => setSearchQuery(event.currentTarget.textContent ?? "")}
                      className="min-w-0 flex-1 text-slate-700 outline-none"
                    ></div>
                  </div>
                  <div ref={fieldMenuRef} className="relative w-72">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsFieldMenuOpen((open) => !open)}
                      onKeyDown={(event) => event.key === "Enter" && setIsFieldMenuOpen((open) => !open)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm font-semibold transition-colors ${isFieldMenuOpen ? "border-slate-400 text-slate-900" : "border-slate-200 text-slate-600"}`}
                    >
                      <span className="max-w-48 truncate">{selectedField}</span>
                      <Icon name="chevron" className={`size-4 transition-transform ${isFieldMenuOpen ? "-rotate-90" : "rotate-90"}`} />
                    </div>
                    {isFieldMenuOpen && (
                      <div className="absolute right-0 top-full z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70">
                        <div className="px-3 pb-2 pt-1 text-xs font-bold tracking-wide text-slate-400">훈련 분야 선택</div>
                        {trainingFields.map((field) => (
                          <div
                            key={field}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setSelectedField(field);
                              setIsFieldMenuOpen(false);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                setSelectedField(field);
                                setIsFieldMenuOpen(false);
                              }
                            }}
                            className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${selectedField === field ? "bg-slate-900 font-bold text-white" : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                          >
                            <span>{field}</span>
                            {selectedField === field && <Icon name="check" className="size-4 shrink-0" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div ref={sortMenuRef} className="relative w-36">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsSortMenuOpen((open) => !open)}
                      onKeyDown={(event) => event.key === "Enter" && setIsSortMenuOpen((open) => !open)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm font-semibold transition-colors ${isSortMenuOpen ? "border-slate-400 text-slate-900" : "border-slate-200 text-slate-600"}`}
                    >
                      {sortOrder}
                      <Icon name="chevron" className={`size-4 transition-transform ${isSortMenuOpen ? "-rotate-90" : "rotate-90"}`} />
                    </div>
                    {isSortMenuOpen && (
                      <div className="absolute right-0 top-full z-30 mt-2 w-full rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70">
                        {(["최신 등록순", "예전 등록순"] as const).map((order) => (
                          <div
                            key={order}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setSortOrder(order);
                              setIsSortMenuOpen(false);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                setSortOrder(order);
                                setIsSortMenuOpen(false);
                              }
                            }}
                            className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm ${sortOrder === order ? "bg-slate-900 font-bold text-white" : "font-semibold text-slate-600 hover:bg-slate-100"}`}
                          >
                            {order}
                            {sortOrder === order && <Icon name="check" className="size-4" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 px-5 pt-4">
                <div className="flex gap-6">
                  {(["전체", "임시 저장", "추출 중", "검수 필요", "검수 완료", "문제 생성 중", "문제 검수 필요", "문제 검수 완료"] as const).map((item) => (
                    <div key={item} role="button" tabIndex={0} onClick={() => setScope(item)} className={`cursor-pointer border-b-2 px-1 pb-4 text-sm font-bold ${scope === item ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="hidden pb-4 text-xs font-semibold text-slate-400 sm:block">총 {sortedDocuments.length}개 중 {rangeStart}–{rangeEnd}</div>
              </div>

              <div className="hidden grid-cols-[minmax(0,2fr)_0.9fr_0.8fr_0.8fr_0.8fr_2rem] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-400 md:grid">
                <span>교범명</span><span>훈련 분야</span><span>분석 상태</span><span>최근 수정</span><span>작업</span><span></span>
              </div>
              <div className="divide-y divide-slate-100">
                {paginatedDocuments.map((doc) => (
                  <div
                    key={doc.name}
                    role={doc.state !== "문제 검수 완료" ? "button" : undefined}
                    tabIndex={doc.state !== "문제 검수 완료" ? 0 : undefined}
                    onClick={() => {
                      if (doc.state === "추출 중") setSelectedExtractionDocument(doc);
                      if (doc.state === "임시 저장") setSelectedDraftDocument(doc);
                      if (doc.state === "검수 필요") setSelectedReviewDocument(doc);
                      if (doc.state === "검수 완료") setSelectedCompletedDocument(doc);
                      if (doc.state === "문제 생성 중") setSelectedGeneratingDocument(doc);
                      if (doc.state === "문제 검수 필요") { setSelectedProblemReviewDocument(doc); setPageMode("problem-preview"); }
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      if (doc.state === "추출 중") setSelectedExtractionDocument(doc);
                      if (doc.state === "임시 저장") setSelectedDraftDocument(doc);
                      if (doc.state === "검수 필요") setSelectedReviewDocument(doc);
                      if (doc.state === "검수 완료") setSelectedCompletedDocument(doc);
                      if (doc.state === "문제 생성 중") setSelectedGeneratingDocument(doc);
                      if (doc.state === "문제 검수 필요") { setSelectedProblemReviewDocument(doc); setPageMode("problem-preview"); }
                    }}
                    className={`group relative grid gap-3 px-6 py-5 transition-colors hover:bg-slate-50 md:grid-cols-[minmax(0,2fr)_0.9fr_0.8fr_0.8fr_0.8fr_2rem] md:items-center md:gap-4 ${doc.state !== "문제 검수 완료" ? "cursor-pointer" : ""} ${openDocumentMenu === doc.name ? "z-20 bg-slate-50" : "z-0"}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><Icon name="file" className="size-5" /></div>
                      <div className="min-w-0"><div className="truncate text-sm font-bold">{doc.name}</div><div className="mt-1 text-xs text-slate-400">{doc.type} · 김관리 등록</div></div>
                    </div>
                    <div className="text-sm font-medium text-slate-600">{doc.field}</div>
                    <div><Badge tone={doc.tone} plain>{doc.state}</Badge></div>
                    <div className="text-xs text-slate-500">{doc.date}</div>
                    <div>
                      {doc.state === "임시 저장" && (
                        <div
                          role="button"
                          tabIndex={extractingDraftName === doc.name ? -1 : 0}
                          onClick={(event) => {
                            event.stopPropagation();
                            void startDraftExtraction(doc.name);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.stopPropagation();
                              void startDraftExtraction(doc.name);
                            }
                          }}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors ${extractingDraftName === doc.name ? "cursor-wait opacity-70" : "cursor-pointer hover:bg-slate-200"}`}
                        >
                          {extractingDraftName === doc.name && <span className="size-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"></span>}
                          {extractingDraftName === doc.name ? "요청 중" : "추출하기"}
                        </div>
                      )}
                      {doc.state === "추출 중" && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            showNotice(`${doc.name} 지식 추출을 중단했습니다.`);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.stopPropagation();
                              showNotice(`${doc.name} 지식 추출을 중단했습니다.`);
                            }
                          }}
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                        >
                          중단하기
                        </div>
                      )}
                      {doc.state === "검수 필요" && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            openDetailedReview(doc);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.stopPropagation();
                              openDetailedReview(doc);
                            }
                          }}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                        >
                          검수하기
                          {(reviewProgress[doc.name]?.completed ?? 0) > 0 && (
                            <span className="rounded bg-slate-300/70 px-1.5 py-0.5 text-[10px] font-black tabular-nums">
                              {reviewProgress[doc.name].completed}/4
                            </span>
                          )}
                        </div>
                      )}
                      {doc.state === "검수 완료" && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            showNotice(`${doc.name} 문제 생성을 시작합니다.`);
                          }}
                          onKeyDown={(event) => event.key === "Enter" && showNotice(`${doc.name} 문제 생성을 시작합니다.`)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                        >
                          문제 생성
                        </div>
                      )}
                      {doc.state === "문제 생성 중" && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            showNotice(`${doc.name} 문제 생성을 중단했습니다.`);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.stopPropagation();
                              showNotice(`${doc.name} 문제 생성을 중단했습니다.`);
                            }
                          }}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                        >
                          <span className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"></span>
                          중단하기
                        </div>
                      )}
                      {doc.state === "문제 검수 필요" && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(event) => { event.stopPropagation(); setProblemReviewPageDocument(doc); setPageMode("problem-review"); }}
                          onKeyDown={(event) => { if (event.key === "Enter") { event.stopPropagation(); setProblemReviewPageDocument(doc); setPageMode("problem-review"); } }}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                        >
                          문제 검수
                          {(problemReviewProgress[doc.name]?.completed ?? 0) > 0 && (
                            <span className="rounded bg-slate-300/70 px-1.5 py-0.5 text-[10px] font-black tabular-nums">
                              {problemReviewProgress[doc.name].completed}/{problemSections.length}
                            </span>
                          )}
                        </div>
                      )}
                      {doc.state === "문제 검수 완료" && (
                        <div className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900">
                          완료
                        </div>
                      )}
                    </div>
                    <div data-document-menu onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} className="relative">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenDocumentMenu((current) => current === doc.name ? null : doc.name);
                        }}
                        onKeyDown={(event) => event.key === "Enter" && setOpenDocumentMenu((current) => current === doc.name ? null : doc.name)}
                        className={`flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors ${openDocumentMenu === doc.name ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"}`}
                      >
                        <Icon name="more" className="size-5" />
                      </div>
                      {openDocumentMenu === doc.name && (
                        <div className="absolute right-0 top-full z-30 mt-2 w-32 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70">
                          {doc.state !== "검수 필요" && (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                showNotice(`${doc.name} 수정 화면을 엽니다.`);
                                setOpenDocumentMenu(null);
                              }}
                              className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              수정
                            </div>
                          )}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              showNotice(`${doc.name} 삭제를 요청했습니다.`);
                              setOpenDocumentMenu(null);
                            }}
                            className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            삭제
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {paginatedDocuments.length === 0 && (
                  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Icon name="search" /></div>
                    <div className="mt-4 text-sm font-bold text-slate-700">검색 결과가 없습니다</div>
                    <p className="mt-1 text-xs text-slate-400">다른 교범명이나 분야로 다시 검색해 주세요.</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <div className="text-xs font-semibold text-slate-400">페이지당 10개</div>
                <div className="flex items-center gap-1">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    onKeyDown={(event) => event.key === "Enter" && setCurrentPage((page) => Math.max(1, page - 1))}
                    className={`flex size-8 items-center justify-center rounded-md border border-slate-200 ${currentPage === 1 ? "cursor-not-allowed text-slate-300" : "cursor-pointer text-slate-500 hover:bg-slate-100"}`}
                  >
                    <Icon name="chevron" className="size-4 rotate-180" />
                  </div>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <div
                      key={page}
                      role="button"
                      tabIndex={0}
                      onClick={() => setCurrentPage(page)}
                      onKeyDown={(event) => event.key === "Enter" && setCurrentPage(page)}
                      className={`flex size-8 cursor-pointer items-center justify-center rounded-md text-xs font-bold ${currentPage === page ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      {page}
                    </div>
                  ))}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    onKeyDown={(event) => event.key === "Enter" && setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className={`flex size-8 items-center justify-center rounded-md border border-slate-200 ${currentPage === totalPages ? "cursor-not-allowed text-slate-300" : "cursor-pointer text-slate-500 hover:bg-slate-100"}`}
                  >
                    <Icon name="chevron" className="size-4" />
                  </div>
                </div>
              </div>
            </section>
          </div>
          ) : pageMode === "register" ? (
            <RegistrationPage
              onBack={() => setPageMode("list")}
              onSave={() => {
                showNotice("교범을 임시 저장했습니다.");
                setPageMode("list");
              }}
            />
          ) : pageMode === "problem-preview" && selectedProblemReviewDocument ? (
            <ProblemPreviewPage
              document={selectedProblemReviewDocument}
              onBack={() => { setPageMode("list"); setSelectedProblemReviewDocument(null); }}
              onStartReview={() => {
                setProblemReviewPageDocument(selectedProblemReviewDocument);
                setSelectedProblemReviewDocument(null);
                setPageMode("problem-review");
              }}
            />
          ) : pageMode === "problem-review" && problemReviewPageDocument ? (
            <ProblemReviewPage
              document={problemReviewPageDocument}
              initialCompleted={problemReviewProgress[problemReviewPageDocument.name]?.completed ?? 0}
              initialSection={problemReviewProgress[problemReviewPageDocument.name]?.current ?? 0}
              onBack={() => setPageMode("list")}
              onApprove={() => {
                showNotice(`${problemReviewPageDocument.name} 문제 검수를 완료했습니다.`);
                setPageMode("list");
              }}
              onSaveDraft={(completed, current) => {
                setProblemReviewProgress((prev) => ({ ...prev, [problemReviewPageDocument.name]: { completed, current } }));
                showNotice("임시 저장 되었습니다.");
              }}
            />
          ) : reviewPageDocument ? (
            <ReviewPage
              document={reviewPageDocument}
              initialCompleted={reviewProgress[reviewPageDocument.name]?.completed ?? 0}
              initialSection={reviewProgress[reviewPageDocument.name]?.current ?? 0}
              onBack={() => setPageMode("list")}
              onApprove={() => {
                showNotice(`${reviewPageDocument.name} 검수를 승인했습니다.`);
                setPageMode("list");
              }}
              onProgress={(completed, total) =>
                setReviewProgress((prev) => ({ ...prev, [reviewPageDocument.name]: { completed: completed === total ? total : completed, current: prev[reviewPageDocument.name]?.current ?? 0 } }))
              }
              onSaveDraft={(completed, current) => {
                setReviewProgress((prev) => ({ ...prev, [reviewPageDocument.name]: { completed, current } }));
                showNotice("임시 저장 되었습니다.");
              }}
            />
          ) : (
            <div></div>
          )}
        </main>
      </div>
      {selectedReviewDocument && (
        <div
          role="presentation"
          onClick={() => setSelectedReviewDocument(null)}
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="검수 필요 교범 상세 정보"
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div className="min-w-0 flex-1 pr-6">
                <div className="mb-2 flex items-center gap-2">
                  <Badge tone="amber">검수 필요</Badge>
                  <span className="text-xs font-semibold text-slate-400">AI 분석 완료</span>
                </div>
                <div className="text-xl font-black">{selectedReviewDocument.name}</div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedReviewDocument(null)}
                onKeyDown={(event) => event.key === "Enter" && setSelectedReviewDocument(null)}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>

            <div className="border-b border-slate-100 p-6">
              <div className="mb-4 text-base font-extrabold text-slate-900">기본 정보</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-400">훈련 분야</div>
                  <div className="mt-2 text-sm font-bold text-slate-700">{selectedReviewDocument.field}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-400">최근 수정</div>
                  <div className="mt-2 text-sm font-bold text-slate-700">{selectedReviewDocument.date}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-400">등록자</div>
                  <div className="mt-2 text-sm font-bold text-slate-700">김관리</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-400">파일 형식</div>
                  <div className="mt-2 text-sm font-bold text-slate-700">{selectedReviewDocument.type}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 text-base font-extrabold text-slate-900">교범 설명</div>
                <div className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                  오염지역에서 분대원이 수행해야 하는 역할과 행동 절차, 정보 공유 방법 및 금지 행동을 정리한 교육 지침입니다.
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 text-base font-extrabold text-slate-900">첨부 파일</div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon name="file" className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-700">{selectedReviewDocument.name}.{selectedReviewDocument.type.toLocaleLowerCase()}</div>
                    <div className="mt-1 text-xs text-slate-400">원본 교범 파일</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-slate-900">분석 결과</div>
                </div>
              </div>
              <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                {[
                  {
                    title: "문서 구조 및 교육과목 분석",
                    description: "교범의 목차와 교육 항목 구조",
                    items: [
                      { label: "교육과목", value: `${selectedReviewDocument.field} 기본훈련` },
                      { label: "교육 사항", value: "위협 및 기본 개념, 상황 식별, 개인 행동 절차, 분대 역할과 협업" },
                    ],
                  },
                  {
                    title: "교육 목표 및 핵심 개념 추출",
                    description: "교육 사항별 학습 구조",
                    items: [
                      { label: "교육 목표", value: "위협 식별, 상황별 행동 판단, 개인 역할 수행, 분대 단위 협업" },
                      { label: "핵심 개념", value: "보호, 경보 전파, 오염 통제, 정보 공유" },
                    ],
                  },
                  {
                    title: "발생 가능 상황 분석 및 추출",
                    description: "상황 단위의 구성 구조",
                    items: [
                      { label: "상황", value: "경보 수신, 오염 의심지역 진입, 분대원 노출" },
                      { label: "발생 조건", value: "경보 발령, 오염 징후 식별, 보호 장비 이상 발생" },
                    ],
                  },
                  {
                    title: "상황별 상세 지침 정의",
                    description: "상황별 수행 및 평가 구조",
                    items: [
                      { label: "행동·순서", value: "개인 보호 → 경보 전파 → 상황 보고 → 후속 조치" },
                      { label: "역할", value: "분대장, 관측자, 전파 담당, 분대원" },
                      { label: "주의·금지 행동", value: "보호 장비 임의 해제 금지, 오염지역 이탈 절차 준수" },
                      { label: "평가기준", value: "상황 인지, 필수 행동 수행, 역할 수행, 정보 공유" },
                    ],
                  },
                ].map((section, index) => (
                  <section key={section.title} className="rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white">{index + 1}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-extrabold">{section.title}</div>
                        <div className="mt-0.5 text-xs text-slate-400">{section.description}</div>
                        <div className="mt-4 space-y-2">
                          {section.items.map((item) => (
                            <div key={item.label} className="grid gap-1 rounded-lg bg-slate-50 px-3 py-2.5 sm:grid-cols-[7rem_1fr] sm:gap-3">
                              <span className="text-xs font-bold text-slate-500">{item.label}</span>
                              <span className="text-xs font-medium leading-relaxed text-slate-700">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button
                icon="check"
                onClick={() => {
                  openDetailedReview(selectedReviewDocument);
                }}
              >
                검수하기
              </Button>
            </div>
          </div>
        </div>
      )}
      {selectedDraftDocument && (
        <div
          role="presentation"
          onClick={closeDraftModal}
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="임시 저장 교범 상세 정보"
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div className="min-w-0 flex-1 pr-6">
                <div className="mb-2 flex items-center gap-2">
                  <Badge tone="neutral">임시 저장</Badge>
                  {isDraftEditing && <Badge tone="blue">수정 중</Badge>}
                </div>
                <div
                  role={isDraftEditing ? "textbox" : undefined}
                  contentEditable={isDraftEditing}
                  suppressContentEditableWarning
                  className={`text-xl font-black outline-none ${isDraftEditing ? "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:border-slate-400" : ""}`}
                >
                  {selectedDraftDocument.name}
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={closeDraftModal}
                onKeyDown={(event) => event.key === "Enter" && closeDraftModal()}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>

            <div className="space-y-6 p-6">
              <section>
                <div className="mb-3 text-sm font-extrabold text-slate-900">기본 정보</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">훈련 분야</div>
                    <div
                      role={isDraftEditing ? "textbox" : undefined}
                      contentEditable={isDraftEditing}
                      suppressContentEditableWarning
                      className={`mt-2 text-sm font-bold text-slate-700 outline-none ${isDraftEditing ? "rounded border border-slate-200 bg-white px-2 py-1.5 focus:border-slate-400" : ""}`}
                    >
                      {selectedDraftDocument.field}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">최근 수정</div>
                    <div className="mt-2 text-sm font-bold text-slate-700">{selectedDraftDocument.date}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">등록자</div>
                    <div className="mt-2 text-sm font-bold text-slate-700">김관리</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">파일 형식</div>
                    <div className="mt-2 text-sm font-bold text-slate-700">{selectedDraftDocument.type}</div>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 text-sm font-extrabold text-slate-900">교범 설명</div>
                <div
                  role={isDraftEditing ? "textbox" : undefined}
                  contentEditable={isDraftEditing}
                  suppressContentEditableWarning
                  className={`min-h-24 rounded-xl border px-4 py-3 text-sm leading-relaxed text-slate-600 outline-none ${isDraftEditing ? "border-slate-300 bg-white focus:border-slate-500" : "border-slate-200 bg-slate-50"}`}
                >
                  오염지역에서 분대원이 수행해야 하는 역할과 행동 절차, 정보 공유 방법 및 금지 행동을 정리한 교육 지침입니다.
                </div>
              </section>

              <section>
                <div className="mb-3 text-sm font-extrabold text-slate-900">첨부 파일</div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><Icon name="file" className="size-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-700">{selectedDraftDocument.name}.{selectedDraftDocument.type.toLocaleLowerCase()}</div>
                    <div className="mt-1 text-xs text-slate-400">원본 교범 파일</div>
                  </div>
                  {isDraftEditing && <Button variant="secondary">파일 교체</Button>}
                </div>
              </section>
            </div>

            <div className="flex items-center justify-end rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                {isDraftEditing && <Button variant="secondary" onClick={() => setIsDraftEditing(false)}>취소</Button>}
                <Button
                  icon={isDraftEditing ? "check" : undefined}
                  onClick={() => {
                    if (isDraftEditing) {
                      showNotice(`${selectedDraftDocument.name} 수정 내용을 저장했습니다.`);
                      setIsDraftEditing(false);
                    } else {
                      setIsDraftEditing(true);
                    }
                  }}
                >
                  {isDraftEditing ? "수정 저장" : "수정"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedExtractionDocument && (
        <div
          role="presentation"
          onClick={() => setSelectedExtractionDocument(null)}
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="추출 작업 상세 정보"
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge tone="blue">추출 중</Badge>
                </div>
                <div className="text-xl font-black">{selectedExtractionDocument.name}</div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedExtractionDocument(null)}
                onKeyDown={(event) => event.key === "Enter" && setSelectedExtractionDocument(null)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>

            <div className="space-y-6 p-6">
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-black text-blue-700">68%</div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <span className="size-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>
                      발생 가능 상황 분석 및 추출 중
                    </div>
                  </div>
                  <div className="shrink-0 text-xs font-semibold text-slate-400">2 / 4단계 완료</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-2/3 rounded-full bg-blue-600"></div>
                </div>
              </section>

              <section>
                <div className="mb-3 text-sm font-extrabold text-slate-900">교범 정보</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">훈련 분야</div>
                    <div className="mt-2 text-sm font-bold text-slate-700">{selectedExtractionDocument.field}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">원본 파일</div>
                    <div className="mt-2 text-sm font-bold text-slate-700">{selectedExtractionDocument.type}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">등록자</div>
                    <div className="mt-2 text-sm font-bold text-slate-700">김관리</div>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-extrabold text-slate-900">추출 현황</div>
                  <span className="text-xs font-semibold text-slate-400">실시간 업데이트</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {[
                    { label: "문서 구조 및 교육과목 분석", value: "완료", tone: "green" as const },
                    { label: "교육 목표 및 핵심 개념 추출", value: "완료", tone: "green" as const },
                    { label: "발생 가능 상황 분석 및 추출", value: "분석 중", tone: "blue" as const },
                    { label: "상황별 상세 지침 정의", value: "대기", tone: "neutral" as const },
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-b-0">
                      <div className={`flex size-7 items-center justify-center rounded-full text-xs font-black ${item.tone === "green" ? "bg-emerald-50 text-emerald-700" : item.tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-400"}`}>
                        {item.tone === "green" ? <Icon name="check" className="size-3.5" /> : index + 1}
                      </div>
                      <span className="flex-1 text-sm font-semibold text-slate-700">{item.label}</span>
                      <Badge tone={item.tone}>{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex items-center justify-end rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button variant="secondary" onClick={() => {
                showNotice(`${selectedExtractionDocument.name} 지식 추출을 중단했습니다.`);
                setSelectedExtractionDocument(null);
              }}>중단하기</Button>
            </div>
          </div>
        </div>
      )}
      {selectedCompletedDocument && (
        <div
          role="presentation"
          onClick={() => setSelectedCompletedDocument(null)}
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="검수 완료 교범 분석 결과"
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div className="min-w-0 flex-1 pr-6">
                <div className="mb-2 flex items-center gap-2">
                  <Badge tone="green">검수 완료</Badge>
                  <span className="text-xs font-semibold text-slate-400">{selectedCompletedDocument.field}</span>
                </div>
                <div className="text-xl font-black">{selectedCompletedDocument.name}</div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedCompletedDocument(null)}
                onKeyDown={(event) => event.key === "Enter" && setSelectedCompletedDocument(null)}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {reviewSections.map((sec, secIndex) => (
                <div key={sec.title} className="border-b border-slate-100 px-6 py-5 last:border-b-0">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white">{secIndex + 1}</span>
                    <div className="text-base font-extrabold">{sec.title}</div>
                  </div>
                  <div className="space-y-3">
                    {sec.rows.map((row) => (
                      <div key={row.label} className="overflow-hidden rounded-xl border border-slate-100">
                        <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                          <span className="text-xs font-bold text-slate-500">{row.label}</span>
                        </div>
                        {row.subItems ? (
                          <div className="divide-y divide-slate-100">
                            {row.subItems.map((sub, subIndex) => (
                              <div key={sub.label} className="grid gap-2 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="flex size-4 items-center justify-center rounded bg-slate-200 text-[9px] font-black text-slate-500">{subIndex + 1}</span>
                                  <span className="text-xs font-semibold text-slate-500">{sub.label}</span>
                                </div>
                                <span className="text-sm font-medium leading-relaxed text-slate-700">{sub.value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3">
                            <span className="text-sm font-medium leading-relaxed text-slate-700">{row.value}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Icon name="check" className="size-4 text-emerald-500" />
                검수 완료 · {selectedCompletedDocument.date}
              </div>
              <Button
                onClick={() => {
                  showNotice(`${selectedCompletedDocument.name} 문제 생성을 시작합니다.`);
                  setSelectedCompletedDocument(null);
                }}
              >
                문제 생성
              </Button>
            </div>
          </div>
        </div>
      )}
      {selectedGeneratingDocument && (() => {
        const problemTitles = [
          "분대원 방독면 미착용 상태에서 경보 수신 시 대응",
          "오염 의심지역 진입 전 장비 점검 누락 상황",
          "분대원 1명 오염 노출 후 제독 절차 미이행",
          "경보 전파 실패로 인접 분대 미대응 상황",
          "분대장 부재 시 부분대장 지휘 전환 절차",
        ];
        const subSteps = [
          "제목 기반 문제 상황 상세 정의",
          "정의된 문제 & 교범 분석 데이터 기반 시나리오 생성 중",
          "시나리오별 필요한 역할군 분류 중",
          "각 역할군별 최적의 행동 답안 생성 중",
          "생성한 답안 평가 중",
        ];
        const problemStatus: ("완료" | "진행 중" | "대기")[] = ["완료", "완료", "진행 중", "대기", "대기"];
        const currentProblemIndex = problemStatus.indexOf("진행 중");
        const currentSubStep = 2;
        const completedProblems = problemStatus.filter((s) => s === "완료").length;
        const totalProgress = Math.round(((completedProblems + currentSubStep / subSteps.length) / problemTitles.length) * 100);

        return (
          <div
            role="presentation"
            onClick={() => setSelectedGeneratingDocument(null)}
            className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                <div className="min-w-0 flex-1 pr-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge tone="blue">문제 생성 중</Badge>
                    <span className="text-xs font-semibold text-slate-400">{selectedGeneratingDocument.field}</span>
                  </div>
                  <div className="text-xl font-black">{selectedGeneratingDocument.name}</div>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedGeneratingDocument(null)}
                  onKeyDown={(event) => event.key === "Enter" && setSelectedGeneratingDocument(null)}
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Icon name="plus" className="size-5 rotate-45" />
                </div>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-black text-blue-700">{totalProgress}%</div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                        <span className="size-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>
                        문제 {currentProblemIndex + 1} · {subSteps[currentSubStep]}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-slate-400">전체 {completedProblems}/{problemTitles.length}문제 완료</div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${totalProgress}%` }}></div>
                  </div>
                </div>

                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    <div className="text-sm font-extrabold text-slate-900">1단계 · 문제 목차 정의</div>
                    <Badge tone="green">완료</Badge>
                  </div>
                  <p className="mb-3 text-xs text-slate-500">개인/분대별로 도출될 수 있는 예상 상황들의 제목을 생성했습니다.</p>
                  <div className="space-y-2">
                    {problemTitles.map((title, i) => (
                      <div key={title} className="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3.5 py-2.5">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">{i + 1}</span>
                        <span className="text-sm font-medium text-slate-700">{title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">2</span>
                    <div className="text-sm font-extrabold text-slate-900">2단계 · 문제별 상세 생성</div>
                  </div>
                  <div className="space-y-3">
                    {problemTitles.map((title, i) => {
                      const status = problemStatus[i];
                      return (
                        <div key={title} className="overflow-hidden rounded-xl border border-slate-200">
                          <div className={`flex items-center gap-3 px-4 py-3 ${status === "진행 중" ? "bg-blue-50" : status === "완료" ? "bg-white" : "bg-slate-50"}`}>
                            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${status === "완료" ? "bg-emerald-100 text-emerald-700" : status === "진행 중" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                              {status === "완료" ? <Icon name="check" className="size-3.5" /> : i + 1}
                            </span>
                            <span className={`flex-1 text-sm font-bold ${status === "대기" ? "text-slate-400" : "text-slate-800"}`}>{title}</span>
                            <Badge tone={status === "완료" ? "green" : status === "진행 중" ? "blue" : "neutral"}>{status}</Badge>
                          </div>
                          {status === "진행 중" && (
                            <div className="divide-y divide-slate-100 border-t border-slate-100">
                              {subSteps.map((step, si) => {
                                const stepDone = si < currentSubStep;
                                const stepActive = si === currentSubStep;
                                return (
                                  <div key={step} className={`flex items-center gap-3 px-4 py-2.5 ${stepActive ? "bg-blue-50/60" : ""}`}>
                                    <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${stepDone ? "bg-emerald-100 text-emerald-600" : stepActive ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-300"}`}>
                                      {stepDone ? <Icon name="check" className="size-3" /> : si + 1}
                                    </span>
                                    <span className={`flex-1 text-xs font-semibold ${stepActive ? "text-blue-800" : stepDone ? "text-slate-500" : "text-slate-300"}`}>{step}</span>
                                    {stepActive && <span className="size-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>}
                                    {stepDone && <Icon name="check" className="size-3.5 text-emerald-500" />}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {status === "완료" && (
                            <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
                              모든 단계 완료 · 5개 역할군 답안 생성됨
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                <Button variant="secondary" onClick={() => {
                  showNotice(`${selectedGeneratingDocument.name} 문제 생성을 중단했습니다.`);
                  setSelectedGeneratingDocument(null);
                }}>중단하기</Button>
              </div>
            </div>
          </div>
        );
      })()}
      {notice && <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"><Icon name="check" className="size-4 text-emerald-400" />{notice}</div>}
    </div>
  );
}
