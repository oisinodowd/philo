-- =====================================================================
-- Seed metadata: Saint Thomas Aquinas corpus skeleton
-- =====================================================================

-- Philosopher
INSERT INTO public.philosophers (slug, name, name_native, birth_year, death_year, tradition, category, bio_short, bio_full, system_prompt, published)
VALUES (
    'thomas-aquinas',
    'Saint Thomas Aquinas',
    'Sanctus Thomas Aquinas',
    1225,
    1274,
    'Scholastic',
    'Theology',
    'Doctor Angelicus — Dominican friar, philosopher, and theologian whose synthesis of Aristotelian philosophy with Christian doctrine defined scholasticism.',
    'Saint Thomas Aquinas (1225–1274) was an Italian Dominican friar, philosopher, Catholic priest, and Doctor of the Church. An immensely influential philosopher, theologian, and jurist in the tradition of scholasticism, he is also known within the latter as the Doctor Angelicus and the Doctor Communis. His best-known works are the Summa Theologica and the Summa contra Gentiles. His commentaries on Aristotle and the Bible, as well as his liturgical hymns, form an essential part of his legacy.',
    E'You are Saint Thomas Aquinas.\nAnswer strictly from your works retrieved below.\nIf the question is not addressed in those passages, respond exactly:\n"I have not written on this, but you should consult: {related_philosopher} — {work}, available in the corpus. You may also open the related passage here [link]."\nNever invent claims, citations, or dates.\nCite passages inline as [Book, Chapter, §offset].\nReturn your reply as JSON: { answer: string, citations: [...], related: [...] }.',
    true
) ON CONFLICT (slug) DO NOTHING;

-- Works (Summa Theologica)
INSERT INTO public.works (philosopher_id, title, title_original, year_written, language, source_url, published)
SELECT
    p.id,
    'Summa Theologica',
    'Summa Theologiae',
    1274,
    'la',
    'https://www.gutenberg.org/ebooks/17611',
    true
FROM public.philosophers p
WHERE p.slug = 'thomas-aquinas'
ON CONFLICT DO NOTHING;

-- Work: Summa contra Gentiles
INSERT INTO public.works (philosopher_id, title, title_original, year_written, language, source_url, published)
SELECT
    p.id,
    'Summa contra Gentiles',
    'Summa contra Gentiles',
    1264,
    'la',
    'https://www.gutenberg.org/ebooks/17531',
    true
FROM public.philosophers p
WHERE p.slug = 'thomas-aquinas'
ON CONFLICT DO NOTHING;

-- Work: De Ente et Essentia
INSERT INTO public.works (philosopher_id, title, title_original, year_written, language, source_url, published)
SELECT
    p.id,
    'On Being and Essence',
    'De Ente et Essentia',
    1256,
    'la',
    'https://isidore.co/aquinas/DeEnte.htm',
    true
FROM public.philosophers p
WHERE p.slug = 'thomas-aquinas'
ON CONFLICT DO NOTHING;

-- Chapter skeletons for Summa Theologica Part I
INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    1,
    'Treatise on Sacred Doctrine (Q1)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    2,
    'Treatise on the One God (Q2–Q26)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    3,
    'Treatise on the Most Holy Trinity (Q27–Q43)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    4,
    'Treatise on the Creation (Q44–Q49)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    5,
    'Treatise on the Angels (Q50–Q64)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    6,
    'Treatise on the Six Days (Q65–Q74)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    7,
    'Treatise on Man (Q75–Q102)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (work_id, chapter_number, title)
SELECT
    w.id,
    8,
    'Treatise on the Conservation and Government of Creatures (Q103–Q119)'
FROM public.works w
JOIN public.philosophers p ON w.philosopher_id = p.id
WHERE p.slug = 'thomas-aquinas' AND w.title = 'Summa Theologica'
ON CONFLICT DO NOTHING;
