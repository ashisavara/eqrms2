'use client';

export default function Page() {
  return (
    <main>
      <div
        className="w-full max-w-screen-2xl mx-auto"
        style={{ aspectRatio: '16 / 9' }}
      >
        <iframe
          src="https://lookerstudio.google.com/embed/reporting/06d20b80-9641-44e2-9984-90931464ef87/page/p_9bighco3cd"
          title="Looker Studio Report"
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          style={{ border: 0 }}
        />
      </div>
    </main>
  );
}
