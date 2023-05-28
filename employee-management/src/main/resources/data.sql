INSERT INTO public.accounts(id, email, password, first_login) -- password=password1!
VALUES ('9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', 'a@email.com', '$2a$10$N65.jSs..LkY1E9VUp6qau.05HcK8AF5JDrtM/9hLVhSE5yNzGZQa', true);
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
VALUES ('84e5cc62-2b3b-4332-89ae-ba74f96f614a', 'GET-PERMISSIONS');
INSERT INTO public.permissions(id, name)
VALUES ('781a137c-e1b2-4f3b-8eed-b1d429f348fe', 'GET-ROLES');
INSERT INTO public.permissions(id, name)
VALUES ('8557bd2e-5e5c-4358-92d1-96331bd72af4', 'ADD-PERMISSION-TO-ROLE');
INSERT INTO public.permissions(id, name)
VALUES ('08768507-67fa-4cde-963e-cf4c55f7d614', 'REMOVE-PERMISSION-FROM-ROLE');
INSERT INTO public.permissions(id, name)
VALUES ('3c27e735-8b39-42e3-8612-d90ca6c750a2', 'GET-PROJECTS');
INSERT INTO public.permissions(id, name)
VALUES ('fdc1213a-8760-4f5d-8ccb-689535b7d593', 'GET-EMPLOYEES');
INSERT INTO public.permissions(id, name)
VALUES ('2cb7a52c-cc57-4261-ae87-ae1bb36dd00b', 'REMOVE-EMPLOYEE-FROM-PROJECT');
INSERT INTO public.permissions(id, name)
VALUES ('5ae800df-a0a8-4eae-8b8b-edf838b55665', 'GET-USER-SKILLS');
INSERT INTO public.permissions(id, name)
VALUES ('6afe5cdf-e9f8-45f9-899b-29d28062c761', 'GET-SKILLS');
INSERT INTO public.permissions(id, name)
VALUES ('8c417449-e458-4934-a8a0-db1a94ed6985', 'CREATE-PROJECT');
INSERT INTO public.permissions(id, name)
VALUES ('7f87b4a0-19db-43fe-a6c3-e1b38950d1d2', 'CREATE-SKILL');
INSERT INTO public.permissions(id, name)
VALUES ('9d9eb54a-a317-4b34-bdee-42fdbf6c0ad7', 'ADD-EMPLOYEE-TO-PROJECT');
INSERT INTO public.permissions(id, name)
VALUES ('f37150ca-8f4e-4e50-bfa5-48c0797b469d', 'UPDATE-USER-PROJECT');
INSERT INTO public.permissions(id, name)
VALUES ('f061927b-5d87-4bb5-9ca4-af3b7252432e', 'UPDATE-REGISTER-USER-INFO');
INSERT INTO public.permissions(id, name)
VALUES ('e31a95dd-42b6-402c-8df1-6884293428b8', 'UPDATE-SKILL');
INSERT INTO public.permissions(id, name)
VALUES ('227e082c-78d9-4eef-bb0a-d22d8abbac70', 'UPLOAD-CV');
INSERT INTO public.permissions(id, name)
VALUES ('b534fa31-95d0-4c63-9a26-4d27696c2de6', 'DELETE-PROJECT');
INSERT INTO public.permissions(id, name)
VALUES ('43182ad7-6915-4aa3-bce5-d412b3d53551', 'REGISTER-ADMIN');
INSERT INTO public.permissions(id, name)
VALUES ('15836cbb-dd75-4747-95ba-bf19d96e00c3', 'GET-USER-PROJECTS');


-- GET-PERMISSIONS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '84e5cc62-2b3b-4332-89ae-ba74f96f614a');
-- GET-ROLES to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '781a137c-e1b2-4f3b-8eed-b1d429f348fe');
-- ADD-PERMISSION-TO-ROLE to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '8557bd2e-5e5c-4358-92d1-96331bd72af4');
-- REMOVE-PERMISSION-FROM-ROLE to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '08768507-67fa-4cde-963e-cf4c55f7d614');
-- GET-PROJECTS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '3c27e735-8b39-42e3-8612-d90ca6c750a2');
-- GET-EMPLOYEES to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'fdc1213a-8760-4f5d-8ccb-689535b7d593');
-- REMOVE-EMPLOYEE-FROM-PROJECT to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '2cb7a52c-cc57-4261-ae87-ae1bb36dd00b');
-- GET-USER-SKILLS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '5ae800df-a0a8-4eae-8b8b-edf838b55665');
-- GET-SKILLS to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '6afe5cdf-e9f8-45f9-899b-29d28062c761');
-- CREATE-PROJECT to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '8c417449-e458-4934-a8a0-db1a94ed6985');
-- CREATE-SKILL to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '7f87b4a0-19db-43fe-a6c3-e1b38950d1d2');
-- ADD-EMPLOYEE-TO-PROJECT to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '9d9eb54a-a317-4b34-bdee-42fdbf6c0ad7');
-- UPDATE-USER-PROJECT to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'f37150ca-8f4e-4e50-bfa5-48c0797b469d');
-- UPDATE-REGISTER-USER-INFO to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'f061927b-5d87-4bb5-9ca4-af3b7252432e');
-- UPDATE-SKILL to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'e31a95dd-42b6-402c-8df1-6884293428b8');
-- UPLOAD-CV to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '227e082c-78d9-4eef-bb0a-d22d8abbac70');
-- DELETE-PROJECT to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', 'b534fa31-95d0-4c63-9a26-4d27696c2de6');
-- REGISTER-ADMIN to Administrator
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('6caccf41-5c54-401d-87b4-05af4d629fda', '43182ad7-6915-4aa3-bce5-d412b3d53551');

-- UPDATE-REGISTER-USER-INFO to Project Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', 'f061927b-5d87-4bb5-9ca4-af3b7252432e');
-- UPDATE-USER-PROJECT to Project Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', 'f37150ca-8f4e-4e50-bfa5-48c0797b469d');
-- ADD-EMPLOYEE-TO-PROJECT to Project Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', '9d9eb54a-a317-4b34-bdee-42fdbf6c0ad7');
-- GET-PROJECTS to Project Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', '3c27e735-8b39-42e3-8612-d90ca6c750a2');
-- GET-USER-PROJECTS to Project Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', '15836cbb-dd75-4747-95ba-bf19d96e00c3');
-- REMOVE-EMPLOYEE-FROM-PROJECT to Project Manager
INSERT INTO public.roles_permissions(role_id, permissions_id)
VALUES ('b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc', '2cb7a52c-cc57-4261-ae87-ae1bb36dd00b');


INSERT INTO register_user_info (id, account_id, first_name, last_name, street, city, country, phone_number, revision_date)
VALUES ('c9bf9e57-1685-4c89-9fd3-5a6e8c8c8f9c', '9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', 'John', 'Doe', '123 Main St', 'New York', 'USA', '555-1234', '2022-01-01');
INSERT INTO public.register_user_info(id, city, country, street, first_name, last_name, phone_number, expiration_date, is_used, token, revision_date, account_id)
VALUES ('ece1b3a6-6db9-4db1-a29a-1eae6e7a543a', 'Sabac', 'Srbija', 'Knez Ive od Semberije', 'Mihailo', 'Veljic', '+3812470650', null, null, null, null, 'd206f89e-73cd-4388-ba29-8f528258db99');
INSERT INTO register_user_info (id, account_id, first_name, last_name, street, city, country, phone_number, revision_date)
VALUES ('c9bf9e57-1685-4c89-9fd3-5a6e8c8c8f9e', '3403bb0f-0d70-40b0-955d-2424d7a5699e', 'Bob', 'Smith', '789 Oak St', 'Chicago', 'USA', '555-9012', '2022-01-03');
INSERT INTO register_user_info (id, account_id, first_name, last_name, street, city, country, phone_number, revision_date)
VALUES ('c9bf9e57-1685-4c89-9fd3-5a6e8c8c8f9f', 'd46fb741-5d9a-44dc-bc70-73ebea53dc25', 'Alice', 'Johnson', '321 Pine St', 'San Francisco', 'USA', '555-3456', '2022-01-04');


INSERT INTO public.projects(id, duration, name, manager_id)
VALUES ('3a6a9b34-7f34-4a56-b1d2-10cd7f0e8b21', 100, 'project name 1', 'd46fb741-5d9a-44dc-bc70-73ebea53dc25');
INSERT INTO public.projects(id, duration, name, manager_id)
VALUES ('f591b0ef-29a7-4e51-9c4f-83496dcfa8db', 200, 'project name 2', 'd46fb741-5d9a-44dc-bc70-73ebea53dc25');

INSERT INTO public.user_project(id, description, end_date, start_date, project_id, account_id)
VALUES ('c0a67112-9c3e-4f15-9f86-6c14be9c0f3c', 'description 1', '2023-05-27T10:30:00', '2023-05-27T10:30:00', '3a6a9b34-7f34-4a56-b1d2-10cd7f0e8b21', 'd206f89e-73cd-4388-ba29-8f528258db99');
INSERT INTO public.user_project(id, description, end_date, start_date, project_id, account_id)
VALUES ('7d899e47-9903-4e6e-9b3f-3d8a33a59c5d', 'description 2', '2023-05-27T10:30:00', '2023-05-27T10:30:00', 'f591b0ef-29a7-4e51-9c4f-83496dcfa8db', 'd206f89e-73cd-4388-ba29-8f528258db99');

INSERT INTO public.skills(id, name, rating, user_id)
VALUES ('f48a2463-303e-4ef1-8a83-4a3c7d03a4f8', 'skill name 1', '5', 'd206f89e-73cd-4388-ba29-8f528258db99');
INSERT INTO public.skills(id, name, rating, user_id)
VALUES ('3a6a9b34-7f34-4a56-b1d2-10cd7f0e8b21', 'skill name 2', '2', 'd206f89e-73cd-4388-ba29-8f528258db99');
