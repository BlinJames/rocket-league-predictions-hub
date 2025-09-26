-- Ajouter des matches d'exemple pour chaque ligue

-- Matches pour RLCS Major 1 New York
INSERT INTO matches (tournament_id, team_a_id, team_b_id, scheduled_at, match_type, stage, status) VALUES
-- Match principal KC vs Falcons
('4016ecf9-a59f-45d8-9073-1d05a27d5aa3', 'f0afc08e-8513-42e1-a599-6909c396aa85', '591a578f-9d43-41ea-835c-cc387934e87c', '2025-12-06 20:00:00+00', 'bo5', 'Grand Final', 'scheduled'),
-- Autres matches
('4016ecf9-a59f-45d8-9073-1d05a27d5aa3', '3afef27d-1e6b-4d18-91f9-16d0de80e86c', 'daea78d5-a514-427b-8cc7-7f3f7e53c764', '2025-12-06 18:00:00+00', 'bo5', 'Semifinals', 'scheduled'),
('4016ecf9-a59f-45d8-9073-1d05a27d5aa3', '0a7c03ff-fcc5-4f84-8cc2-c79cc7ee4f51', 'e4dff91d-47b7-4632-92eb-3f0076607b4f', '2025-12-06 16:00:00+00', 'bo5', 'Semifinals', 'scheduled'),
('4016ecf9-a59f-45d8-9073-1d05a27d5aa3', 'f0afc08e-8513-42e1-a599-6909c396aa85', '3afef27d-1e6b-4d18-91f9-16d0de80e86c', '2025-12-05 20:00:00+00', 'bo7', 'Quarterfinals', 'scheduled');

-- Matches pour RLCS Major 2 Paris
INSERT INTO matches (tournament_id, team_a_id, team_b_id, scheduled_at, match_type, stage, status) VALUES
('5efe0914-abfd-455e-a820-97c55b2d6013', 'e4dff91d-47b7-4632-92eb-3f0076607b4f', '0a7c03ff-fcc5-4f84-8cc2-c79cc7ee4f51', '2026-05-12 19:00:00+00', 'bo5', 'Grand Final', 'scheduled'),
('5efe0914-abfd-455e-a820-97c55b2d6013', 'f0afc08e-8513-42e1-a599-6909c396aa85', 'daea78d5-a514-427b-8cc7-7f3f7e53c764', '2026-05-12 17:00:00+00', 'bo5', 'Semifinals', 'scheduled'),
('5efe0914-abfd-455e-a820-97c55b2d6013', '591a578f-9d43-41ea-835c-cc387934e87c', '3afef27d-1e6b-4d18-91f9-16d0de80e86c', '2026-05-11 20:00:00+00', 'bo7', 'Quarterfinals', 'scheduled');

-- Matches pour RLCS World Championship Lyon (en cours)
INSERT INTO matches (tournament_id, team_a_id, team_b_id, scheduled_at, match_type, stage, status) VALUES
('7c665f43-c2ec-4550-867a-e869d608690b', 'daea78d5-a514-427b-8cc7-7f3f7e53c764', '3afef27d-1e6b-4d18-91f9-16d0de80e86c', '2025-09-28 20:00:00+00', 'bo5', 'Grand Final', 'scheduled'),
('7c665f43-c2ec-4550-867a-e869d608690b', 'f0afc08e-8513-42e1-a599-6909c396aa85', '591a578f-9d43-41ea-835c-cc387934e87c', '2025-09-28 18:00:00+00', 'bo5', 'Semifinals', 'scheduled'),
('7c665f43-c2ec-4550-867a-e869d608690b', '0a7c03ff-fcc5-4f84-8cc2-c79cc7ee4f51', 'e4dff91d-47b7-4632-92eb-3f0076607b4f', '2025-09-27 20:00:00+00', 'bo7', 'Quarterfinals', 'scheduled');