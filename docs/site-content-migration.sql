create table if not exists site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;
create policy "public read" on site_content for select using (true);
create policy "admin write" on site_content for all using (auth.jwt()->>'email' = 'michele.fay@sfr.fr');

insert into site_content (key, value) values
  ('about_intro', 'Michel Faye consacre son écriture à préserver les fragments du temps vécu — souvenirs d''enfance, histoires familiales et reflets d''une époque révolue. Sa démarche est celle d''une femme convaincue que les mots sont le seul antidote à l''oubli. À travers ses récits, elle tisse un pont entre les générations pour que rien d''essentiel ne se perde.'),
  ('about_quote', '« Chaque écrit est un fil tendu vers ceux qui viendront après nous. »'),
  ('about_section1_title', 'Un engagement au quotidien'),
  ('about_section1_body', 'Chaque jour, Michel Faye prend la plume pour capturer ce que la mémoire risque de laisser glisser entre ses doigts. Cette discipline quotidienne est pour elle un acte d''amour envers les siens et envers elle-même.'),
  ('about_section2_title', 'L''écriture comme héritage'),
  ('about_section2_body', 'Les textes de Michel Faye ne sont pas seulement des souvenirs — ils sont un legs vivant destiné aux enfants, aux petits-enfants, à tous ceux qui chercheront un jour à comprendre d''où ils viennent. Écrire, pour elle, c''est offrir aux générations futures la matière même de leur identité.'),
  ('contact_intro', 'Vous souhaitez laisser un message à Michel Faye ? N''hésitez pas à écrire.')
on conflict (key) do nothing;
