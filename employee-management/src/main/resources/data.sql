INSERT INTO public.accounts(id, email, password) -- password=password
VALUES ('9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', 'a@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm');
INSERT INTO public.accounts(id, email, password) -- password=password
VALUES ('d206f89e-73cd-4388-ba29-8f528258db99', 'se@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm');
INSERT INTO public.accounts(id, email, password) -- password=password
VALUES ('3403bb0f-0d70-40b0-955d-2424d7a5699e', 'hm@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm');
INSERT INTO public.accounts(id, email, password) -- password=password
VALUES ('d46fb741-5d9a-44dc-bc70-73ebea53dc25', 'pm@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm');

INSERT INTO public.roles(id, name)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'Administrator');
INSERT INTO public.roles(id, name)
VALUES ('9a4d712a-2882-4278-b981-76d339fc6894', 'Software Engineer');
INSERT INTO public.roles(id, name)
VALUES ('3ad3288e-1fad-45cc-aa7f-8660ce4af4e4', 'HR Manager');
INSERT INTO public.roles(id, name)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', 'Project Manager');

INSERT INTO public.accounts_roles(account_id, roles_id)
VALUES ('9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', '6caccf41-5c54-401d-87b4-05af4d629fda');
INSERT INTO public.accounts_roles(account_id, roles_id)
VALUES ('d206f89e-73cd-4388-ba29-8f528258db99', '9a4d712a-2882-4278-b981-76d339fc6894');
INSERT INTO public.accounts_roles(account_id, roles_id)
VALUES ('3403bb0f-0d70-40b0-955d-2424d7a5699e', '3ad3288e-1fad-45cc-aa7f-8660ce4af4e4');
INSERT INTO public.accounts_roles(account_id, roles_id)
VALUES ('d46fb741-5d9a-44dc-bc70-73ebea53dc25', 'b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc');


--ADD NEW PERMISSIONS HERE
INSERT INTO public.permissions(id, name)
VALUES ('eaf64bf2-0604-4d44-88db-f14712e7c7ad', 'TEST');
INSERT INTO public.permissions(id, name)
VALUES ('84e5cc62-2b3b-4332-89ae-ba74f96f614a', 'GET-PERMISSIONS');
INSERT INTO public.permissions(id, name)
VALUES ('781a137c-e1b2-4f3b-8eed-b1d429f348fe', 'GET-ROLES');
INSERT INTO public.permissions(id, name)
VALUES ('8557bd2e-5e5c-4358-92d1-96331bd72af4', 'UPDATE-ROLE-PERMISSIONS');

-- GET-PERMISSIONS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('84e5cc62-2b3b-4332-89ae-ba74f96f614a', 'eaf64bf2-0604-4d44-88db-f14712e7c7ad');
-- GET-ROLES to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('781a137c-e1b2-4f3b-8eed-b1d429f348fe', 'eaf64bf2-0604-4d44-88db-f14712e7c7ad');
-- UPDATE-ROLE-PERMISSIONS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('8557bd2e-5e5c-4358-92d1-96331bd72af4', 'eaf64bf2-0604-4d44-88db-f14712e7c7ad');
--TEST to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'eaf64bf2-0604-4d44-88db-f14712e7c7ad');
--TEST to Software Engineer
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('9a4d712a-2882-4278-b981-76d339fc6894', 'eaf64bf2-0604-4d44-88db-f14712e7c7ad');
--TEST to HR Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('3ad3288e-1fad-45cc-aa7f-8660ce4af4e4', 'eaf64bf2-0604-4d44-88db-f14712e7c7ad');
--TEST to Project Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', 'eaf64bf2-0604-4d44-88db-f14712e7c7ad');