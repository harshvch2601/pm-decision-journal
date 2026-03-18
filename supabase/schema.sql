-- PM Decision Journal — Database Schema
-- Run this in your Supabase SQL editor

-- DECISIONS TABLE
create table decisions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  rationale text,
  category text,
  confidence int check (confidence between 1 and 5),
  expected_outcome text,
  sprint_label text,
  created_at timestamptz default now(),
  review_30_due timestamptz,
  review_60_due timestamptz,
  review_90_due timestamptz
);

-- OUTCOMES TABLE
create table outcomes (
  id uuid default gen_random_uuid() primary key,
  decision_id uuid references decisions(id) on delete cascade,
  review_window int check (review_window in (30, 60, 90)),
  actual_outcome text,
  outcome_rating text check (outcome_rating in ('better', 'as_expected', 'worse')),
  lessons_learned text,
  accuracy_score int check (accuracy_score between 1 and 5),
  claude_reflection text,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table decisions enable row level security;
alter table outcomes enable row level security;

-- POLICIES
create policy "Users can manage their own decisions"
  on decisions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own outcomes"
  on outcomes for all
  using (
    decision_id in (
      select id from decisions where user_id = auth.uid()
    )
  );