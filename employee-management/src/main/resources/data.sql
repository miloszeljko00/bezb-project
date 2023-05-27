INSERT INTO public.accounts(id, email, password, first_login) -- password=password
VALUES ('9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', 'a@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', false);
INSERT INTO public.accounts(id, email, password, first_login) -- password=password
VALUES ('d206f89e-73cd-4388-ba29-8f528258db99', 'se@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', false);
INSERT INTO public.accounts(id, email, password, first_login) -- password=password
VALUES ('3403bb0f-0d70-40b0-955d-2424d7a5699e', 'hm@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', false);
INSERT INTO public.accounts(id, email, password, first_login) -- password=password
VALUES ('d46fb741-5d9a-44dc-bc70-73ebea53dc25', 'pm@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', false);

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
VALUES ('8557bd2e-5e5c-4358-92d1-96331bd72af4', 'ADD-PERMISSION-TO-ROLE');
INSERT INTO public.permissions(id, name)
VALUES ('08768507-67fa-4cde-963e-cf4c55f7d614', 'REMOVE-PERMISSION-TO-ROLE');
INSERT INTO public.permissions(id, name)
VALUES ('3c27e735-8b39-42e3-8612-d90ca6c750a2', 'GET-PROJECTS');
INSERT INTO public.permissions(id, name)
VALUES ('fdc1213a-8760-4f5d-8ccb-689535b7d593', 'GET-EMPLOYEES');


-- GET-PERMISSIONS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '84e5cc62-2b3b-4332-89ae-ba74f96f614a');
-- GET-ROLES to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '781a137c-e1b2-4f3b-8eed-b1d429f348fe');
-- ADD-PERMISSION-TO-ROLE to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '8557bd2e-5e5c-4358-92d1-96331bd72af4');
-- REMOVE-PERMISSION-TO-ROLE to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '08768507-67fa-4cde-963e-cf4c55f7d614');
-- GET-PROJECTS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '3c27e735-8b39-42e3-8612-d90ca6c750a2');
-- GET-EMPLOYEES to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'fdc1213a-8760-4f5d-8ccb-689535b7d593');

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

INSERT INTO public.register_user_info(id, city, country, street, first_name, last_name, phone_number, expiration_date, is_used, token, revision_date, account_id)
VALUES ('ece1b3a6-6db9-4db1-a29a-1eae6e7a543a', 'Sabac', 'Srbija', 'Knez Ive od Semberije', 'Mihailo', 'Veljic', '+3812470650', null, null, null, null, 'd206f89e-73cd-4388-ba29-8f528258db99');

INSERT INTO public.projects(id, duration, name, manager_id)
VALUES ('3a6a9b34-7f34-4a56-b1d2-10cd7f0e8b21', 100, 'project name 1', 'd206f89e-73cd-4388-ba29-8f528258db99');
INSERT INTO public.projects(id, duration, name, manager_id)
VALUES ('f591b0ef-29a7-4e51-9c4f-83496dcfa8db', 200, 'project name 2', 'd206f89e-73cd-4388-ba29-8f528258db99');

INSERT INTO public.user_project(id, description, end_date, start_date, project_id, account_id)
VALUES ('c0a67112-9c3e-4f15-9f86-6c14be9c0f3c', 'description 1', '2023-05-27T10:30:00', '2023-05-27T10:30:00', '3a6a9b34-7f34-4a56-b1d2-10cd7f0e8b21', 'd206f89e-73cd-4388-ba29-8f528258db99');
INSERT INTO public.user_project(id, description, end_date, start_date, project_id, account_id)
VALUES ('7d899e47-9903-4e6e-9b3f-3d8a33a59c5d', 'description 2', '2023-05-27T10:30:00', '2023-05-27T10:30:00', 'f591b0ef-29a7-4e51-9c4f-83496dcfa8db', 'd206f89e-73cd-4388-ba29-8f528258db99');

INSERT INTO public.skills(id, name, rating, user_id)
VALUES ('f48a2463-303e-4ef1-8a83-4a3c7d03a4f8', 'skill name 1', '5', 'd206f89e-73cd-4388-ba29-8f528258db99');
INSERT INTO public.skills(id, name, rating, user_id)
VALUES ('3a6a9b34-7f34-4a56-b1d2-10cd7f0e8b21', 'skill name 2', '2', 'd206f89e-73cd-4388-ba29-8f528258db99');

