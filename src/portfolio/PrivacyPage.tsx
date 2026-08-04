// Страница политики обработки персональных данных (152-ФЗ).
// Самозанятый (плательщик НПД), оператор ПД — физическое лицо.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { profile } from "./data";

const OPERATOR = {
  fio: "Матвеев Виталий Кириллович",
  inn: "141003558298",
  status: "Самозанятый (плательщик НПД)",
  region: "г. Якутск, Республика Саха (Якутия)",
  email: profile.email,
  telegram: profile.telegram,
  whatsapp: profile.whatsapp,
  site: "https://www.matveev-devs.ru",
};

const UPDATED = "4 августа 2026 г.";

export function PrivacyPage() {
  useEffect(() => {
    document.title = "Политика обработки персональных данных — matveev-devs.ru";
  }, []);

  return (
    <div className="min-h-screen bg-(--pf-bg) text-(--pf-text)">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Link
          to="/"
          className="font-code inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--pf-text-4) transition-colors hover:text-(--pf-text)"
        >
          <ArrowLeft className="size-4" />
          На главную
        </Link>

        <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight text-(--pf-text) sm:text-4xl">
          Политика обработки персональных данных
        </h1>
        <p className="font-code mt-3 text-xs text-(--pf-text-5)">
          Редакция от {UPDATED}
        </p>

        <div className="mt-8 space-y-6 font-body text-sm leading-relaxed text-(--pf-text-3)">
          <Section title="1. Общие положения">
            <p>
              Настоящая Политика определяет порядок обработки и защиты
              персональных данных пользователей сайта{" "}
              <a
                href={OPERATOR.site}
                className="font-medium text-(--pf-lime) underline underline-offset-2"
              >
                {OPERATOR.site}
              </a>{" "}
              (далее — «Сайт»).
            </p>
            <p>
              Оператор персональных данных — {OPERATOR.fio},{" "}
              {OPERATOR.status}, ИНН {OPERATOR.inn}, регион регистрации:{" "}
              {OPERATOR.region} (далее — «Оператор»).
            </p>
            <p>
              Использование Сайта означает безоговорочное согласие пользователя
              с настоящей Политикой и указанными в ней условиями обработки
              персональных данных.
            </p>
          </Section>

          <Section title="2. Какие данные собираются">
            <p>Через форму заявки на Сайте Оператор получает:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>имя, которое пользователь указывает самостоятельно;</li>
              <li>
                контактные данные (телефон, Telegram или e-mail) — для связи по
                заявке;
              </li>
              <li>
                текстовое описание задачи — если пользователь заполнил
                соответствующее поле.
              </li>
            </ul>
            <p>
              Также автоматически собираются технические данные: IP-адрес
              (для защиты от спама), тип браузера и источник перехода — через
              сервис Vercel Analytics. Эти данные обезличены и не позволяют
              идентифицировать пользователя без дополнительных сведений.
            </p>
          </Section>

          <Section title="3. Цели обработки">
            <p>Персональные данные используются исключительно для:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>связи с пользователем по оставленной заявке;</li>
              <li>ответа на вопросы и подготовки коммерческого предложения;</li>
              <li>защиты Сайта от автоматического спама.</li>
            </ul>
            <p>
              Оператор не передаёт персональные данные третьим лицам и не
              продаёт их. Данные не используются для рекламных рассылок без
              отдельного согласия пользователя.
            </p>
          </Section>

          <Section title="4. Правовое основание">
            <p>
              Обработка персональных данных осуществляется на основании согласия
              пользователя (ст. 6 Федерального закона № 152-ФЗ «О персональных
              данных»), выраженного путём заполнения формы заявки и отметки
              согласия с настоящей Политикой.
            </p>
          </Section>

          <Section title="5. Срок хранения">
            <p>
              Персональные данные хранятся до достижения цели обработки (как
              правило — до завершения переписки по заявке), но не более 3 лет.
              После истечения срока данные удаляются.
            </p>
          </Section>

          <Section title="6. Передача данных (третьи лица)">
            <p>
              Оператор использует сторонние сервисы для технического обеспечения
              работы Сайта:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Telegram</strong> (Bot API) — для доставки заявок
                Оператору;
              </li>
              <li>
                <strong>Vercel</strong> — хостинг Сайта и аналитика посещений.
              </li>
            </ul>
            <p>
              Передача данных этим сервисам ограничена технической
              необходимостью и регулируется их собственными политиками
              конфиденциальности.
            </p>
          </Section>

          <Section title="7. Права пользователя">
            <p>В соответствии со ст. 15–17 Закона № 152-ФЗ пользователь вправе:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>получить информацию об обрабатываемых о нём данных;</li>
              <li>потребовать уточнения, блокировки или удаления данных;</li>
              <li>отозвать согласие на обработку.</li>
            </ul>
            <p>
              Для реализации этих прав необходимо направить запрос Оператору
              любым удобным способом (см. контакты ниже).
            </p>
          </Section>

          <Section title="8. Контакты Оператора">
            <p>По вопросам обработки персональных данных обращаться:</p>
            <ul className="space-y-1.5 pl-0">
              <li>
                <span className="text-(--pf-text-5)">ФИО:</span>{" "}
                {OPERATOR.fio}
              </li>
              <li>
                <span className="text-(--pf-text-5)">ИНН:</span> {OPERATOR.inn}
              </li>
              <li>
                <span className="text-(--pf-text-5)">Регион:</span>{" "}
                {OPERATOR.region}
              </li>
              <li>
                <span className="text-(--pf-text-5)">E-mail:</span>{" "}
                <a
                  href={`mailto:${OPERATOR.email}`}
                  className="text-(--pf-lime) underline underline-offset-2"
                >
                  {OPERATOR.email}
                </a>
              </li>
              <li>
                <span className="text-(--pf-text-5)">Telegram:</span>{" "}
                <a
                  href={OPERATOR.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-(--pf-lime) underline underline-offset-2"
                >
                  {OPERATOR.telegram}
                </a>
              </li>
              <li>
                <span className="text-(--pf-text-5)">WhatsApp:</span>{" "}
                <a
                  href={OPERATOR.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="text-(--pf-lime) underline underline-offset-2"
                >
                  {OPERATOR.whatsapp}
                </a>
              </li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 border-t border-(--pf-border-soft) pt-6">
          <p className="font-code text-[11px] leading-relaxed text-(--pf-text-5)">
            © {new Date().getFullYear()} {OPERATOR.fio}. {OPERATOR.status}.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display mb-3 text-lg font-semibold text-(--pf-text)">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
