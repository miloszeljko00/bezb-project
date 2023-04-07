INSERT INTO public.accounts(id, email, password, role) -- password=password
VALUES ('9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', 'admin@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', 'ADMIN');

INSERT INTO public.accounts(id, email, password, role) -- password=password
VALUES ('d206f89e-73cd-4388-ba29-8f528258db99', 'ca@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', 'CERTIFICATE_AUTHORITY');

INSERT INTO public.accounts(id, email, password, role) -- password=password
VALUES ('3403bb0f-0d70-40b0-955d-2424d7a5699e', 'entity@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', 'ENTITY');



INSERT INTO public.admins(id, account_id)
VALUES ('8cff54a5-fb38-43db-9c01-ae383fc4e9be', '9d8eeb20-b52a-430f-9d0d-72cbaf592cf9');

INSERT INTO certificate_holders (dtype, id, certificate_holder_type, x500name, account_id)
VALUES ('CertificateAuthority', '8cff54a5-fb38-43db-9c01-ae383fc4e9be', 'CA', 'CN=MyCA', 'd206f89e-73cd-4388-ba29-8f528258db99');

INSERT INTO certificate_holders (dtype, id, certificate_holder_type, x500name, account_id)
VALUES ('Entity', 'e58e7a07-d5e5-4337-9e9d-fa8b56053727', 'User', 'CN=JohnDoe', '3403bb0f-0d70-40b0-955d-2424d7a5699e');
