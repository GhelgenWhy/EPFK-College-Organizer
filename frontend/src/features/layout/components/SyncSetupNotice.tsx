import { useNavigate } from "react-router";
import { useCurrentProfile } from "../../auth/useCurrentProfile";
import { SyncWarningIcon } from "./SyncWarningIcon";

/**
 * Shown to a signed-in user who has never completed a Moodle sync: until then the schedule,
 * tasks and disciplines stay empty. It is a persistent notice, not a toast, because the state
 * lasts until the user enters credentials; the profile page is where they are entered.
 *
 * It floats in the bottom-right corner instead of taking layout space, so pages that size
 * themselves against the viewport (including the dashboard's cat placement) keep their layout.
 */
export function SyncSetupNotice() {
    const { profile, isLoading, retry } = useCurrentProfile();
    const navigate = useNavigate();

    // Only judge after the profile arrives: while loading, or when it failed, stay quiet.
    if (isLoading || !profile || profile.lastSync) return null;

    return (
        <div
            className="fixed right-[22px] bottom-[22px] z-[80] w-[min(430px,calc(100vw-44px))] rounded-[14px] border border-[var(--warning-soft)] bg-[var(--warning-soft)] px-4 py-3 text-[var(--warning)] shadow-[0_8px_24px_var(--shadow-color)] max-[760px]:right-3 max-[760px]:bottom-[80px] max-[760px]:w-[calc(100vw-24px)]"
            role="status"
            aria-live="polite">
            <div className="flex items-start gap-2.5">
                <SyncWarningIcon className="mt-[1px] h-[22px] w-[22px]" />
                <div className="min-w-0">
                    <p className="m-0 text-[13px] font-bold">
                        Синхронізацію з Moodle не налаштовано
                    </p>
                    <p className="m-0 mt-1 text-[12px] leading-[1.45]">
                        Вкажіть логін і пароль від Moodle у профілі та збережіть - після цього
                        підтягнуться розклад, дисципліни й завдання.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="min-h-[30px] cursor-pointer rounded-lg border-0 bg-[var(--warning)] px-3 text-xs font-bold text-[var(--surface)] hover:opacity-90 focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px]">
                            Налаштувати
                        </button>
                        <button
                            type="button"
                            onClick={() => void retry()}
                            className="min-h-[30px] cursor-pointer rounded-lg border-0 bg-transparent px-2 text-xs font-semibold text-[var(--warning)] underline underline-offset-2 hover:opacity-80 focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px]">
                            Я вже зберіг
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
