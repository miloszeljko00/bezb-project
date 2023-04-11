INSERT INTO public.accounts(id, email, password, role) -- password=password
VALUES ('9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', 'admin@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', 'ADMIN');

INSERT INTO public.accounts(id, email, password, role) -- password=password
VALUES ('d206f89e-73cd-4388-ba29-8f528258db99', 'ca@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', 'CERTIFICATE_AUTHORITY');

INSERT INTO public.accounts(id, email, password, role) -- password=password
VALUES ('3403bb0f-0d70-40b0-955d-2424d7a5699e', 'entity@email.com', '$2a$10$4pFoxuSM5qyfKzY3w7.hLe0zZ9lGACY7QyN2xz9u4lmE7tpkf5GGm', 'ENTITY');



INSERT INTO certificate_holders (dtype, id, certificate_holder_type, x500name, account_id, is_deleted)
VALUES ('Admin', '662eefaa-b19d-4d99-a942-9f8287cdd9c3', 'ADMIN', 'UID=28e1cf9f-e62a-4a50-9599-b0f68090358b, CN=Jane Doe, E=admin@email.com, O=ABC Corporation, OU=Marketing, C=US, ST=New York, L=New York City', '9d8eeb20-b52a-430f-9d0d-72cbaf592cf9', false);

INSERT INTO certificate_holders (dtype, id, certificate_holder_type, x500name, account_id, is_deleted)
VALUES ('CertificateAuthority', '8cff54a5-fb38-43db-9c01-ae383fc4e9be', 'CERTIFICATE_AUTHORITY', 'UID=8cff54a5-fb38-43db-9c01-ae383fc4e9be, CN=John Smith, E=ca@email.com, O=XYZ Industries, OU=Research and Development, C=CA, ST=California, L=San Jose', 'd206f89e-73cd-4388-ba29-8f528258db99', false);

INSERT INTO certificate_holders (dtype, id, certificate_holder_type, x500name, account_id, is_deleted)
VALUES ('Entity', 'e58e7a07-d5e5-4337-9e9d-fa8b56053727', 'ENTITY', 'UID=e58e7a07-d5e5-4337-9e9d-fa8b56053727, CN=Bob Johnson, E=entity@email.com, O=123 Company, OU=Sales, C=GB, ST=London, L=Westminster', '3403bb0f-0d70-40b0-955d-2424d7a5699e', false);
