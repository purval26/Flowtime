SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."analytics_events" ("id", "event_type", "platform", "metadata", "created_at") VALUES
	('507df72a-2dbe-4647-b4e4-1505ee86ccd1', 'page_view', 'web', '{"path": "/"}', '2026-08-24 18:46:53.00815+00'),
	('5f09f87e-5495-472a-83da-dc7a1f7571e6', 'page_view', 'web', '{"path": "/"}', '2026-08-24 18:46:53.009225+00'),
	('28a21dbd-5d20-4095-b2c1-c0374793761f', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 18:46:53.010769+00'),
	('9646e483-c8eb-483b-aea4-738507382db7', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:04:07.957427+00'),
	('98c43408-ee46-42a3-9a8f-d1645e7a2119', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:04:07.949068+00'),
	('ca116e60-56bd-43d2-af36-cc3376243980', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:04:07.966247+00'),
	('0934f46d-8a6c-4c48-bd78-51ab25642cae', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:15:54.961383+00'),
	('8da109de-c9cb-42fd-8e2f-fae102dcd92e', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:15:54.964022+00'),
	('dbb52be7-583a-46e5-afd8-19c0afc54234', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:15:54.965759+00'),
	('23f92d0b-2c4d-4fb8-acac-87c4fa89f9d9', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:27:39.208365+00'),
	('05379af5-37bd-4956-94c6-98a310406fac', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:27:39.208352+00'),
	('1b6ffba1-e6bd-413d-afe6-ac2765e0a59c', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:27:39.209819+00'),
	('6bcbc3c9-3c48-4cab-9439-d91dae67f177', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:37:22.326306+00'),
	('47495e45-9097-43c9-a885-45a737151e8a', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:37:22.343624+00'),
	('c0e6a89d-c24a-4c46-b1b5-1dbfdfed13d0', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:37:22.362416+00'),
	('0bb9875c-8989-48a9-a6ea-ada97c512113', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:37:41.241598+00'),
	('f965135b-1033-42f0-82fb-e0bc072bca41', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:37:41.242055+00'),
	('9822a68c-1495-4206-a487-72429e2efa2f', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:37:41.299933+00'),
	('90ddef11-d811-4ab4-930d-a6634f664f43', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:37:53.743287+00'),
	('639a5ee5-af68-4281-9190-165b15ec9c03', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:37:53.744872+00'),
	('6c9d1d2e-7198-4a9c-bbdd-cbb415674d7f', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:37:53.75479+00'),
	('057bbc7a-5fd7-443a-8686-d2245b3513e6', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:39:12.244499+00'),
	('c51cb822-e68b-4e8d-aa81-3fdd3ddad342', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:39:12.25596+00'),
	('fb388696-35d9-4f93-90e4-a350752c20a0', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:39:12.333705+00'),
	('e0e5ab85-5e06-4e7e-9848-b0a289ed5726', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:39:18.653802+00'),
	('e2e1513f-524e-4f7c-a112-788036749f2f', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:39:18.654668+00'),
	('1c6b8819-ce6d-4d74-9ad1-fafac0a5b5e9', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:39:18.658502+00'),
	('f736931f-9a77-4db1-a756-94010a57c06e', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:39:22.636498+00'),
	('196dd905-6ef1-440f-815d-b8078dfa88a8', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:39:22.637343+00'),
	('e624f5ce-6fe9-42f8-a868-09550f1fb92c', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:40:42.168216+00'),
	('50e0708f-10e1-436c-958b-e84a83073e22', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:40:42.174204+00'),
	('12c6d728-5eb1-4a3d-9fea-ec6688f38daf', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:40:46.34486+00'),
	('cdf47983-6072-4c76-88f3-3cb6eb83c1e7', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:40:46.345868+00'),
	('2d6ab00a-d399-4992-92c6-6f17efa50475', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:40:51.271588+00'),
	('0b0b6dec-610b-4067-a960-17ea928408f3', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:40:51.27119+00'),
	('5705473b-4283-4ddc-878d-da3f02a6ec00', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:40:51.305678+00'),
	('ba252c3e-4d62-48e0-9e03-c0c9af7b44e5', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:41:09.247313+00'),
	('a93382e4-8567-4800-a7b9-93868217eedd', 'page_view', 'web', '{"path": "/timetable"}', '2026-08-24 19:41:23.644593+00'),
	('a3a0ecc3-5ee8-4676-8e33-4e611b216ed4', 'page_view', 'web', '{"path": "/timetable"}', '2026-08-24 19:41:23.644605+00'),
	('4bf8bcb3-1860-4563-8d08-393cefe9141e', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:41:40.613783+00'),
	('218b1b05-f5e2-4c64-814e-65ffc2411a59', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:41:40.676314+00'),
	('48d7cf56-9db0-4d49-a950-a4b02f40916c', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:41:40.65131+00'),
	('75dbdf8f-8d3f-45fc-ba20-2962700bad6f', 'page_view', 'web', '{"path": "/timetable"}', '2026-08-24 19:41:49.649942+00'),
	('a2d80a2a-45b1-4c6c-b1ce-b9b0a0c92012', 'page_view', 'web', '{"path": "/timetable"}', '2026-08-24 19:41:49.652451+00'),
	('0aa77bbe-867a-42f8-9d07-93f9076c5dba', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:41:51.005136+00'),
	('fce6fe75-c5eb-4caf-844b-ad82518276b9', 'page_view', 'web', '{"path": "/"}', '2026-08-24 19:41:51.004612+00'),
	('2272fb95-bc0a-4f07-9c78-6dedd5b30f39', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-24 19:41:51.038567+00'),
	('9b7aa53d-5a62-4fbb-9f70-aa7399ea395e', 'page_view', 'web', '{"path": "/"}', '2026-08-25 07:45:09.229681+00'),
	('d7a01e65-89e4-44cd-a52b-d12be0354e34', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-25 07:45:09.231201+00'),
	('f77006b8-aad2-47ca-8312-e939f9f7acb9', 'page_view', 'web', '{"path": "/"}', '2026-08-25 07:45:09.290521+00'),
	('7fa24103-1c2f-4052-b0f3-d214e660f989', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:07:17.228019+00'),
	('33c65a39-a97d-45c5-a288-febc57c51b57', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:07:23.31185+00'),
	('0d61f6b8-3569-42a2-8464-6839ebd0854a', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:07:32.837693+00'),
	('d5246ad9-fd9a-4872-8851-c5e322d7718b', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:07:37.444441+00'),
	('f7e69248-40c5-4a6a-b856-d430efd53401', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:07:59.983175+00'),
	('b98a64cd-fee4-4dc7-b8e7-3a1b468928f0', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:08:00.840846+00'),
	('b0d348f3-6205-4b97-b9c9-b9c80b394216', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:08:11.838301+00'),
	('d30c4631-5b2e-4dca-a51e-f0512fdf544f', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:08:14.472592+00'),
	('e8dd6a8b-8398-4dd7-a8d5-c8a70d2fd85a', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:08:26.401243+00'),
	('9f2dd7a8-a96e-4995-822f-63fc501aaaa6', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:08:28.199831+00'),
	('03b46ba8-a93d-4a2e-8630-64657bbe8211', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:09:25.02779+00'),
	('9a6c23ed-bb34-41cb-8de2-c6168caee536', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:09:25.881629+00'),
	('0699eec9-b3ba-41e1-95dd-367a7b931bdc', 'theme_toggled', 'mobile', '{"theme": "light"}', '2026-08-25 08:09:27.895682+00'),
	('29a79b29-7a7f-4566-b68f-52ad1a47e2a3', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:09:28.600483+00'),
	('81e89205-9c97-44cf-b823-91331d36ad84', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:09:29.633516+00'),
	('41c73091-b40e-4c7a-b13d-213f09ca6a09', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:09:30.385375+00'),
	('bbe59836-ca21-461a-92f2-600ba12e3dc6', 'theme_toggled', 'mobile', '{"theme": "dark"}', '2026-08-25 08:09:30.977654+00'),
	('14628d13-81fb-48cf-8523-c11f3f37add7', 'theme_toggled', 'mobile', '{"theme": "system"}', '2026-08-25 08:09:31.363835+00'),
	('1a326737-4033-49b0-91e1-739baf779337', 'class_selected', 'mobile', '{"class_id": "335594e8-bcf1-49de-9448-df3e0be864d2"}', '2026-08-25 08:09:33.060902+00'),
	('0864b39a-28a1-4c10-aa44-5e6c20a28b92', 'class_selected', 'mobile', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-25 08:09:34.204288+00'),
	('d0ecc13b-d777-4e2c-8d57-6890c891410a', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:09:35.093882+00'),
	('5eb50614-e437-4fb4-9b35-17d139decd93', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:12:30.298762+00'),
	('4fc0e78e-8fd3-40ab-93f3-d66da8f65cf1', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:12:32.336287+00'),
	('93e2aa3a-9501-45c8-9888-629ea3d92f4b', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:12:33.411384+00'),
	('172987c8-5292-42fe-90f4-8ff9692ec03c', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:12:35.593743+00'),
	('92fc9932-17e4-4501-928b-e648c44dfb0f', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:13:11.187832+00'),
	('9d741f0d-008e-40bb-b417-4bf1657240ca', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:13:11.671877+00'),
	('71bb2bda-efba-487f-8c38-db02f3b3cf3c', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:13:12.626494+00'),
	('4896c1ff-8f4c-499e-b2b7-5b2d255fc31d', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:13:13.02288+00'),
	('16017af4-b4ef-4d74-9823-a5719ea54d1d', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:13:14.167821+00'),
	('9a5bea75-1576-4dd4-a100-c9cee7b82cd5', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:13:16.537505+00'),
	('b8a71f1b-f5b3-49e3-a13f-f7938d997e34', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:13:17.770287+00'),
	('ca9a2a53-8bb8-47f2-8dc5-10d7021588c0', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:13:18.271439+00'),
	('bc82b71c-b855-43d8-936e-435ed899a6be', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:13:19.269662+00'),
	('9f4cbcf6-dcc4-4d3c-aa4d-31793f89d73f', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:13:26.489779+00'),
	('2289b203-4d63-4a64-9920-e31584ee4a64', 'page_view', 'web', '{"path": "/"}', '2026-08-25 08:20:11.845445+00'),
	('a6ace474-8f42-4294-8e51-c0b5a4074c20', 'page_view', 'web', '{"path": "/"}', '2026-08-25 08:20:11.856734+00'),
	('6292b49e-0674-4ce7-8b79-c76653d9f126', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-25 08:20:11.845483+00'),
	('1e0506e3-fa09-4e1f-a34d-fa6a9d8282a6', 'page_view', 'web', '{"path": "/"}', '2026-08-25 08:22:17.793387+00'),
	('afccc19b-282f-4ca9-88a7-b67863a21e48', 'page_view', 'web', '{"path": "/"}', '2026-08-25 08:22:17.80221+00'),
	('d2bee19a-8dff-4a65-9c62-a8feb23f5ab6', 'class_selected', 'web', '{"class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7"}', '2026-08-25 08:22:17.79998+00'),
	('25e065fd-1ced-494b-ada2-55767d8e3a86', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:22:37.018297+00'),
	('af4582a3-cdb3-492c-b600-7c0938993f50', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:22:37.435608+00'),
	('268c2e16-e3c1-420e-9196-cf2e71b24f8b', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:22:38.255931+00'),
	('a5ba1979-5e83-4e84-b671-ca5b2eafe40c', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:22:40.568087+00'),
	('260deb86-3caf-4d90-bc0d-b19ae00eae2e', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:23:00.337047+00'),
	('52ff2f72-3417-450a-898a-5b55cea2bf4b', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:23:16.209878+00'),
	('a464dfe0-4070-4ace-a6e3-9add8d581e48', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:23:17.975009+00'),
	('22cdbed9-3d72-47e4-9602-4d1a784f6043', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:23:18.839898+00'),
	('9ecffdef-cfad-4cf5-835d-824562498423', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:23:21.173107+00'),
	('9b207ec0-8dda-44b1-8ce2-2c0cb96c5a56', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:23:22.748138+00'),
	('3a468a99-68e7-4c16-a18d-ee0175d853a0', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:23:39.342364+00'),
	('933c5de9-479e-429c-9a31-d63dd71b11db', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:24:31.61103+00'),
	('82cfdf4f-4860-434c-bbac-6c9fa80b0ced', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:24:32.041487+00'),
	('e93dcc1c-6cb0-4b4c-b049-76007ebb9ffc', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:24:32.906643+00'),
	('80776183-7f07-4a5a-aca4-7f3f2f5c8753', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:24:33.813742+00'),
	('24c43e9c-1314-4b28-a5d9-0b5d623e39ec', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:24:37.533173+00'),
	('c241c0f4-9ea5-4c30-bda4-2c47be9fbe3b', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:24:37.987378+00'),
	('e6b9968d-e2f9-431f-8204-3c63636bf3b3', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:24:38.552446+00'),
	('1c8f22f7-a3b9-40eb-8919-8bae9a98d4d2', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:29:52.477735+00'),
	('fef64d2e-e58e-40e0-9e94-c445b7e6560d', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:29:58.151535+00'),
	('e24bffd4-450d-46e5-b8ea-06eea3190522', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:30:22.529974+00'),
	('b526d20f-5e49-4c93-ac86-2005fbf56a2c', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:30:28.214084+00'),
	('e06be280-7732-42aa-8e3d-2d191311f3b9', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:31:18.450435+00'),
	('0a7bc0f5-e26f-4644-8f4d-d88697a3b319', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:36:17.223922+00'),
	('5e491d24-7d9e-46ff-a75a-753a02b8b339', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:36:24.629296+00'),
	('3a9abdfb-893a-4c94-b025-5a18857826b6', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:36:32.164555+00'),
	('f641b7e5-e3c5-48c5-b4a2-8842237208f7', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:36:38.607823+00'),
	('bafd9d03-9e3d-49e4-aace-87375fec024e', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:36:40.121013+00'),
	('26def984-b63a-4f98-a523-004e33880cef', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:39:41.803727+00'),
	('e0c5c952-1469-418e-9507-6ee1e768496b', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:39:45.416737+00'),
	('cf4817ac-4043-4708-96f0-f3a0196b3fec', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:39:45.739369+00'),
	('0d7ebed1-63d2-4e03-8d05-c72cf6635f11', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:39:46.564377+00'),
	('2fc1b4c0-a4f0-4d07-a904-f8f0bc687881', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:39:47.446523+00'),
	('6395ee19-1866-4b4d-82cb-4fbcac766a43', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:39:48.197362+00'),
	('0ae0ff68-27ed-42a2-8258-bb9ce30fe288', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:39:49.356676+00'),
	('75d048e9-7cdb-4154-9f15-82238d2f603a', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:39:49.919244+00'),
	('818f19a7-b471-4603-926e-277a3bca5f5f', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:39:50.395973+00'),
	('ee236104-73c6-47e5-8abb-9e5084f87f4b', 'theme_toggled', 'mobile', '{"theme": "light"}', '2026-08-25 08:39:51.568783+00'),
	('1a305631-5178-4988-bee3-6b7d34802869', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:39:52.300617+00'),
	('87ed2fc0-dd6c-4e2a-b4dd-f81b62f1a07b', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:39:54.697444+00'),
	('a6471a02-5388-40e4-8a0e-eae28e861347', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:40:00.745958+00'),
	('be80365c-796f-4eb3-9cc8-accb554212e2', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:40:21.882156+00'),
	('0c36b101-f2a5-45bd-96c2-3e6ec5e9cab5', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:40:23.566035+00'),
	('f1790af8-54c2-4e4d-bda7-285767ba7046', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:40:34.616601+00'),
	('15fdd188-63ef-4486-97b2-c57b1131e626', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:40:41.284621+00'),
	('13757176-a1cc-4f50-8c69-50e93269dffe', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:47:24.939228+00'),
	('d590bebf-5dbd-43d4-97ac-00b7414e52a0', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:47:27.211643+00'),
	('cae2b2a5-1523-48c9-a00e-676dcb142c1b', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:48:30.49508+00'),
	('aec5b504-364c-4c75-aa77-6094392a24ba', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:48:31.448104+00'),
	('db55dfac-7ddf-4795-9ed3-5617656b49e9', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:48:32.285343+00'),
	('521eacfd-73cd-4db6-ada2-997f0c0e67de', 'page_view', 'mobile', '{"tab": "timetable"}', '2026-08-25 08:49:01.753115+00'),
	('622534c0-297d-4653-a605-c91cfb478631', 'page_view', 'mobile', '{"tab": "admin"}', '2026-08-25 08:49:03.434799+00'),
	('38b2f0a0-8060-48aa-81f6-8feb717750ee', 'page_view', 'mobile', '{"tab": "settings"}', '2026-08-25 08:49:04.173227+00'),
	('dcb9d547-8308-453a-ad93-d032a03b1834', 'page_view', 'mobile', '{"tab": "dashboard"}', '2026-08-25 08:49:05.28305+00');


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."classes" ("id", "name", "academic_year", "section", "created_at", "updated_at") VALUES
	('a9be933d-faeb-4d6c-ae33-e2c4699691a7', 'Computer Engineering', '1st SEM', 'Class 13 Batch C', '2026-08-24 16:34:42.364918+00', '2026-08-24 16:34:42.364918+00'),
	('335594e8-bcf1-49de-9448-df3e0be864d2', 'Computer Engineering', '1st SEM', 'Class 13 Batch A', '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00'),
	('193102c0-a412-4eb0-b8e0-b25b0d0d2e9c', 'Computer Engineering', '1st SEM', 'Class 13 Batch B', '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "display_name", "avatar_url", "created_at", "updated_at") VALUES
	('eed80886-8b6a-4fb8-814e-28164d91e1da', 'admin@test.com', 'admin', NULL, '2026-08-24 16:18:30.378561+00', '2026-08-24 16:18:30.378561+00');


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."audit_logs" ("id", "user_id", "action", "target_table", "target_id", "old_data", "new_data", "created_at") VALUES
	('879249db-3210-48e9-9d01-228fb0eca29e', NULL, 'INSERT', 'rooms', '69de7f5a-ddc3-4131-a8e8-0ef78e850d7b', NULL, '{"id": "69de7f5a-ddc3-4131-a8e8-0ef78e850d7b", "name": "203", "building": "2nd Floor", "created_at": "2026-08-24T18:14:05.169588+00:00", "updated_at": "2026-08-24T18:14:05.169588+00:00"}', '2026-08-24 18:14:05.169588+00'),
	('0da31559-9f51-4bcd-adf7-5a0148f5ec86', NULL, 'INSERT', 'professors', 'a7da8147-97ed-4d3f-babe-05afee1d4c2f', NULL, '{"id": "a7da8147-97ed-4d3f-babe-05afee1d4c2f", "name": ".", "email": null, "created_at": "2026-08-24T18:14:05.169588+00:00", "short_name": "SSR", "updated_at": "2026-08-24T18:14:05.169588+00:00"}', '2026-08-24 18:14:05.169588+00'),
	('bbb78056-b00f-46d7-a99b-ad774d978db3', NULL, 'INSERT', 'classes', '335594e8-bcf1-49de-9448-df3e0be864d2', NULL, '{"id": "335594e8-bcf1-49de-9448-df3e0be864d2", "name": "Computer Engineering", "section": "Class 13 Batch A", "created_at": "2026-08-24T18:14:05.169588+00:00", "updated_at": "2026-08-24T18:14:05.169588+00:00", "academic_year": "1st SEM"}', '2026-08-24 18:14:05.169588+00'),
	('d328d170-d4c8-43c2-850d-06fb12bdeeeb', NULL, 'INSERT', 'classes', '193102c0-a412-4eb0-b8e0-b25b0d0d2e9c', NULL, '{"id": "193102c0-a412-4eb0-b8e0-b25b0d0d2e9c", "name": "Computer Engineering", "section": "Class 13 Batch B", "created_at": "2026-08-24T18:14:05.169588+00:00", "updated_at": "2026-08-24T18:14:05.169588+00:00", "academic_year": "1st SEM"}', '2026-08-24 18:14:05.169588+00'),
	('82e241ee-e567-42ae-b674-20260b2b4050', NULL, 'INSERT', 'timetables', '33ff0513-2128-4395-a2e9-1fd1faac4425', NULL, '{"id": "33ff0513-2128-4395-a2e9-1fd1faac4425", "name": "COM13A", "class_id": "335594e8-bcf1-49de-9448-df3e0be864d2", "is_active": true, "created_at": "2026-08-24T18:14:05.169588+00:00", "updated_at": "2026-08-24T18:14:05.169588+00:00", "effective_from": "2026-08-12", "effective_until": null}', '2026-08-24 18:14:05.169588+00'),
	('b1468f42-fc6b-4841-8f9e-720cf5f23b61', NULL, 'INSERT', 'timetables', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', NULL, '{"id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1", "name": "COM13B", "class_id": "193102c0-a412-4eb0-b8e0-b25b0d0d2e9c", "is_active": true, "created_at": "2026-08-24T18:14:05.169588+00:00", "updated_at": "2026-08-24T18:14:05.169588+00:00", "effective_from": "2026-08-12", "effective_until": null}', '2026-08-24 18:14:05.169588+00'),
	('5605371a-bd1d-42c7-8c1d-a4681d9c5f64', NULL, 'INSERT', 'timetable_entries', 'bda1bb0f-4b91-40c9-a111-f6935847015c', NULL, '{"id": "bda1bb0f-4b91-40c9-a111-f6935847015c", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "10:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "c273c3ff-0520-433d-a223-7a3aea8aadab", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('92d3cabc-37d6-4999-af24-0a9cbaf99fb2', NULL, 'INSERT', 'timetable_entries', 'a5f83428-390b-4c08-af23-4493b34568de', NULL, '{"id": "a5f83428-390b-4c08-af23-4493b34568de", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "162273b8-2c51-47d8-b090-408e4c02cc23", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "920356bb-c406-441c-a565-c2fc01a9b2ae", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('19c4634f-e96a-4336-a19a-75258d875c1e', NULL, 'INSERT', 'timetable_entries', '4538faef-da32-4cad-b407-e9df1e178193', NULL, '{"id": "4538faef-da32-4cad-b407-e9df1e178193", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('93bc4a71-300a-4565-9aed-a097b2973e9d', NULL, 'INSERT', 'timetable_entries', 'e47de464-9e36-4249-94c5-929be0e6113f', NULL, '{"id": "e47de464-9e36-4249-94c5-929be0e6113f", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": null, "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('1ff46269-1850-4143-946a-dc724e94bcc8', NULL, 'INSERT', 'timetable_entries', '29bf5e22-5155-4786-bac6-6fae97812d91', NULL, '{"id": "29bf5e22-5155-4786-bac6-6fae97812d91", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('8bce7809-7a86-48dd-ac35-be2190ba36e4', NULL, 'INSERT', 'timetable_entries', '6d72220e-55df-4c59-a3a5-b9cfb4a7b94b', NULL, '{"id": "6d72220e-55df-4c59-a3a5-b9cfb4a7b94b", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "15:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "13:45:00", "subject_id": "26d85aa2-c25e-47dd-98d9-286bf1fc51a1", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "bef1b36c-7d16-4628-944b-259d70bebdbb", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('9283c1ba-e678-4c18-a0dd-a7dda8f63ced', NULL, 'INSERT', 'timetable_entries', 'c4da3361-7524-441a-adb5-bb92ccec2584', NULL, '{"id": "c4da3361-7524-441a-adb5-bb92ccec2584", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "10:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "9cd05983-90d0-449d-817d-7b8f63d180af", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('d0be49e6-fde6-41c9-ba0c-d000ccc76e6f', NULL, 'INSERT', 'timetable_entries', 'cc105947-2619-4ca3-a3fb-cc65cc2d7fbb', NULL, '{"id": "cc105947-2619-4ca3-a3fb-cc65cc2d7fbb", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "3c46c851-6ece-47b7-8fe2-f8d67ea9ee90", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('0827af39-f2d8-4c42-b5b4-93dcb9075e93', NULL, 'INSERT', 'timetable_entries', '322e77d4-6ff0-462b-8bde-025f091a47b5', NULL, '{"id": "322e77d4-6ff0-462b-8bde-025f091a47b5", "type": "lecture", "label": null, "notes": null, "room_id": "fba7f282-fc4d-4941-adab-00d66bd71183", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "3ab6b924-83b5-41f1-84b8-7fa332541f6b", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "02794951-62fb-4a9e-b7fa-81ce277bb3e9", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('0df4c865-9672-4bf4-bfb9-8363a3795789', NULL, 'INSERT', 'timetable_entries', '293ae28d-958f-40f7-84fc-ae86bc7d9def', NULL, '{"id": "293ae28d-958f-40f7-84fc-ae86bc7d9def", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": null, "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('c911f7aa-74ce-46f0-a1c8-bed5f97381fa', NULL, 'INSERT', 'timetable_entries', '0a2a4604-ec95-472e-a0fc-4227acee118c', NULL, '{"id": "0a2a4604-ec95-472e-a0fc-4227acee118c", "type": "lecture", "label": null, "notes": null, "room_id": "fba7f282-fc4d-4941-adab-00d66bd71183", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "3ab6b924-83b5-41f1-84b8-7fa332541f6b", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "02794951-62fb-4a9e-b7fa-81ce277bb3e9", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('c6a385e7-fc5d-46ed-b2e6-30023608b3b6', NULL, 'INSERT', 'timetable_entries', '68e2939e-8879-4b12-92e1-6323db0c6182', NULL, '{"id": "68e2939e-8879-4b12-92e1-6323db0c6182", "type": "lecture", "label": null, "notes": null, "room_id": "31b2f1a4-cb99-4774-bad0-2361168769c3", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": "9cd05983-90d0-449d-817d-7b8f63d180af", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('e65f5403-8fb5-42c8-8ac7-b4bd2dab1ced', NULL, 'INSERT', 'timetable_entries', '09b894e6-eac6-4c5b-b4d2-7d8d590efbfd', NULL, '{"id": "09b894e6-eac6-4c5b-b4d2-7d8d590efbfd", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('66caa40d-7398-4c1a-be09-7d97d8290cb7', NULL, 'INSERT', 'timetable_entries', 'f95a84f9-567f-4a04-9ab5-4ed345ea5968', NULL, '{"id": "f95a84f9-567f-4a04-9ab5-4ed345ea5968", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": null, "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('237a7fd9-0717-44db-86c4-5534ee543c7c', NULL, 'INSERT', 'timetable_entries', 'acad5500-e81b-4080-b3bb-4608159f5ebc', NULL, '{"id": "acad5500-e81b-4080-b3bb-4608159f5ebc", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": "9cd05983-90d0-449d-817d-7b8f63d180af", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('069db6fc-3fc7-4ab8-aec3-0ba546f5c23f', NULL, 'INSERT', 'timetable_entries', '3340cb9b-ff2e-4f48-958b-20c046a1e96f', NULL, '{"id": "3340cb9b-ff2e-4f48-958b-20c046a1e96f", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "162273b8-2c51-47d8-b090-408e4c02cc23", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": "ddcd0756-e5fa-4a46-9497-804576393244", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('1f21ccf2-6d18-4bed-b7f0-e4244d41902f', NULL, 'INSERT', 'timetable_entries', '9bcdb2f9-d189-4b4d-956f-98e5a6177b48', NULL, '{"id": "9bcdb2f9-d189-4b4d-956f-98e5a6177b48", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": "527a88a6-f482-45d0-b59d-c2756e413590", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('94a9ee8c-acda-4c0a-ac18-d0cf4dec8b8e', NULL, 'INSERT', 'timetable_entries', 'b00bbbc2-c19e-41b7-97ef-409c47546698', NULL, '{"id": "b00bbbc2-c19e-41b7-97ef-409c47546698", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": null, "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('6bc8f300-e2b4-461b-81d8-2523303772b7', NULL, 'INSERT', 'timetable_entries', 'be769e3c-4fb1-47e7-a9fd-8e0ac8c70e29', NULL, '{"id": "be769e3c-4fb1-47e7-a9fd-8e0ac8c70e29", "type": "lecture", "label": null, "notes": null, "room_id": "c70c86b7-7d19-4f1e-ac96-d89fde7d606f", "end_time": "14:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": "c273c3ff-0520-433d-a223-7a3aea8aadab", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('d125dfff-c67e-46fa-a38c-6b670efc8211', NULL, 'INSERT', 'timetable_entries', 'febdf4bb-5deb-4eff-ad5a-bbcc7d48f155', NULL, '{"id": "febdf4bb-5deb-4eff-ad5a-bbcc7d48f155", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "10:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('9e231742-8df0-4100-b55c-c8d1311823c1', NULL, 'INSERT', 'timetable_entries', '5873d391-15c2-428f-aaa0-f93185c15288', NULL, '{"id": "5873d391-15c2-428f-aaa0-f93185c15288", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "6eae96a7-dd53-4993-92b7-d2e92d505a11", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('c24ea814-9e45-4fb1-ba24-06238331354a', NULL, 'INSERT', 'timetable_entries', '268b7dfb-0c72-4902-9d22-a06c35189127', NULL, '{"id": "268b7dfb-0c72-4902-9d22-a06c35189127", "type": "lecture", "label": null, "notes": null, "room_id": "1b250ffc-8b69-4f3a-ad2e-d9620731098d", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "26d85aa2-c25e-47dd-98d9-286bf1fc51a1", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "4339dfe3-1f82-4ab4-b6e2-5a8d50919abb", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('29e71b6b-b2a8-4aa5-ae33-b5830455358f', NULL, 'INSERT', 'timetable_entries', 'a248c3ef-23ca-48fe-96ef-20ee462e1bf6', NULL, '{"id": "a248c3ef-23ca-48fe-96ef-20ee462e1bf6", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": null, "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('6ca890a9-216b-4a04-95ff-99e3503c8173', NULL, 'INSERT', 'timetable_entries', 'f5ffab53-420f-4b55-8827-37fba812b8e1', NULL, '{"id": "f5ffab53-420f-4b55-8827-37fba812b8e1", "type": "lecture", "label": null, "notes": null, "room_id": "1b250ffc-8b69-4f3a-ad2e-d9620731098d", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "26d85aa2-c25e-47dd-98d9-286bf1fc51a1", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "22d20cd0-26f9-49f9-836d-9a5b32a40e81", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:14:05.169588+00'),
	('c19f0551-f3d5-43fa-8058-f15e1f3c04a0', NULL, 'INSERT', 'timetable_entries', '490fd224-b7c2-4a89-a0ba-de80faae4d22', NULL, '{"id": "490fd224-b7c2-4a89-a0ba-de80faae4d22", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "10:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "c273c3ff-0520-433d-a223-7a3aea8aadab", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('12c22f00-db9a-48a3-84f5-df3cc62b68e2', NULL, 'INSERT', 'timetable_entries', '81fb164c-de51-4b6a-9ec4-b9c93b604411', NULL, '{"id": "81fb164c-de51-4b6a-9ec4-b9c93b604411", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "162273b8-2c51-47d8-b090-408e4c02cc23", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "920356bb-c406-441c-a565-c2fc01a9b2ae", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('bdd09bf4-ce53-45df-a99e-c71921ef7a17', NULL, 'INSERT', 'timetable_entries', '2eeffa7d-7213-440f-90be-1ea5b1c8b1db', NULL, '{"id": "2eeffa7d-7213-440f-90be-1ea5b1c8b1db", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "d9191848-3562-4b34-bcbe-3abdb9d6ce57", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('6db2f177-da0b-4269-abeb-0f65b3cad1e1', NULL, 'INSERT', 'timetable_entries', 'f964f785-56b8-4a88-b07b-a79716db3489', NULL, '{"id": "f964f785-56b8-4a88-b07b-a79716db3489", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": null, "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('bcf96c55-3e88-497a-b8cf-d97ba323672e', NULL, 'INSERT', 'timetable_entries', 'bfc32f2f-6344-4f2c-9cd3-1007c0da275b', NULL, '{"id": "bfc32f2f-6344-4f2c-9cd3-1007c0da275b", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "d9191848-3562-4b34-bcbe-3abdb9d6ce57", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('35efdef0-a934-4b77-80e5-7a9026f6439d', NULL, 'INSERT', 'timetable_entries', '28036961-6003-4b12-9399-53b3a49ee43a', NULL, '{"id": "28036961-6003-4b12-9399-53b3a49ee43a", "type": "lecture", "label": null, "notes": null, "room_id": "31b2f1a4-cb99-4774-bad0-2361168769c3", "end_time": "15:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "13:45:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "6eae96a7-dd53-4993-92b7-d2e92d505a11", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('e19ead4e-c836-43e7-99eb-a2f0e01f292f', NULL, 'INSERT', 'timetable_entries', '606c858d-dd9f-439a-8b62-ef692ce6cc24', NULL, '{"id": "606c858d-dd9f-439a-8b62-ef692ce6cc24", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "10:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "9cd05983-90d0-449d-817d-7b8f63d180af", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('a0474d1d-3ea8-4518-96ce-4584b88151b2', NULL, 'INSERT', 'timetable_entries', 'b7f0a908-e55b-4c69-9e52-50281bf2a3c2', NULL, '{"id": "b7f0a908-e55b-4c69-9e52-50281bf2a3c2", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "3c46c851-6ece-47b7-8fe2-f8d67ea9ee90", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('81c1c7fd-c5ba-48f6-a45b-e5120ffbeddc', NULL, 'INSERT', 'timetable_entries', '9a532691-3776-4898-9e3b-645f8bd59de9', NULL, '{"id": "9a532691-3776-4898-9e3b-645f8bd59de9", "type": "lecture", "label": null, "notes": null, "room_id": "69de7f5a-ddc3-4131-a8e8-0ef78e850d7b", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "26d85aa2-c25e-47dd-98d9-286bf1fc51a1", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "bef1b36c-7d16-4628-944b-259d70bebdbb", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('4182d0eb-5ac5-4679-9c75-a3aca6607712', NULL, 'INSERT', 'timetable_entries', 'eb04f614-a156-4159-a57d-d0e9ae1d8ab7', NULL, '{"id": "eb04f614-a156-4159-a57d-d0e9ae1d8ab7", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": null, "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('5ee4f9d5-af6e-4713-82e9-c100448ef272', NULL, 'INSERT', 'timetable_entries', '0df43edf-e92a-47f6-a365-29f92ec19ff6', NULL, '{"id": "0df43edf-e92a-47f6-a365-29f92ec19ff6", "type": "lecture", "label": null, "notes": null, "room_id": "69de7f5a-ddc3-4131-a8e8-0ef78e850d7b", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "26d85aa2-c25e-47dd-98d9-286bf1fc51a1", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 2, "professor_id": "4339dfe3-1f82-4ab4-b6e2-5a8d50919abb", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('03904fc7-c697-4d71-ad05-a40d775d710b', NULL, 'INSERT', 'timetable_entries', '9b06e787-db1e-4c31-a1d1-db084b5eb958', NULL, '{"id": "9b06e787-db1e-4c31-a1d1-db084b5eb958", "type": "lecture", "label": null, "notes": null, "room_id": "c70c86b7-7d19-4f1e-ac96-d89fde7d606f", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": "c273c3ff-0520-433d-a223-7a3aea8aadab", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('74e80773-2520-40e9-a7da-3d42999053b8', NULL, 'INSERT', 'timetable_entries', '054dde51-9541-4bac-8c78-b7f81a8cfd83', NULL, '{"id": "054dde51-9541-4bac-8c78-b7f81a8cfd83", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('f5cf5c91-0bd4-4975-aa6c-7f347beb59ed', NULL, 'INSERT', 'timetable_entries', '732471a5-0e51-44f4-a25b-61a050a2bad7', NULL, '{"id": "732471a5-0e51-44f4-a25b-61a050a2bad7", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": null, "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('edc58404-9c0e-4b36-8bb5-ce5e06b360db', NULL, 'INSERT', 'timetable_entries', '9f239396-7edd-4137-86b3-a199a936bdd5', NULL, '{"id": "9f239396-7edd-4137-86b3-a199a936bdd5", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 3, "professor_id": "9cd05983-90d0-449d-817d-7b8f63d180af", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('9abb1719-5204-4c90-b1c4-b2945c327cea', NULL, 'INSERT', 'timetable_entries', 'db38f74d-ecc6-4aff-9af0-06bd2ce95431', NULL, '{"id": "db38f74d-ecc6-4aff-9af0-06bd2ce95431", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "162273b8-2c51-47d8-b090-408e4c02cc23", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": "ddcd0756-e5fa-4a46-9497-804576393244", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('fdce1147-6632-4932-aa17-934bf16d9973', NULL, 'INSERT', 'timetable_entries', '2b255f37-23ab-44d9-81f9-194257a599a3', NULL, '{"id": "2b255f37-23ab-44d9-81f9-194257a599a3", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "6e376d7c-9787-47f3-8cd1-5f0c02506622", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": "527a88a6-f482-45d0-b59d-c2756e413590", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('f34884c1-10ec-4730-9462-6d7a4ee257aa', NULL, 'INSERT', 'timetable_entries', '76da597f-e2e1-40e8-9d8c-f7c3bbcbebb9', NULL, '{"id": "76da597f-e2e1-40e8-9d8c-f7c3bbcbebb9", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": null, "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('b978f970-3368-4d40-98d2-a130e512364a', NULL, 'INSERT', 'timetable_entries', '19e4bf12-aa7b-4b18-a01d-5bb084487550', NULL, '{"id": "19e4bf12-aa7b-4b18-a01d-5bb084487550", "type": "lecture", "label": null, "notes": null, "room_id": "fba7f282-fc4d-4941-adab-00d66bd71183", "end_time": "14:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "3ab6b924-83b5-41f1-84b8-7fa332541f6b", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 4, "professor_id": "a7da8147-97ed-4d3f-babe-05afee1d4c2f", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('7e3ccf71-9e36-47e1-98a6-b3cc80ee0674', NULL, 'INSERT', 'timetable_entries', '18d80145-2098-4fad-91dc-e6c6cb26039c', NULL, '{"id": "18d80145-2098-4fad-91dc-e6c6cb26039c", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "10:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "09:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('e6bc63bb-3c7b-4460-9d4f-916dc2e55daf', NULL, 'INSERT', 'timetable_entries', 'df4d6152-c500-465d-9e62-a9b4d6057019', NULL, '{"id": "df4d6152-c500-465d-9e62-a9b4d6057019", "type": "lecture", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "11:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "10:15:00", "subject_id": "05632734-a849-43c2-9c14-f7c868feea5d", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "6eae96a7-dd53-4993-92b7-d2e92d505a11", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('c6f22900-e21a-454c-9b9e-58c713b45e8c', NULL, 'INSERT', 'timetable_entries', '7a6a34f7-191c-4c10-b44d-d1a239ceb220', NULL, '{"id": "7a6a34f7-191c-4c10-b44d-d1a239ceb220", "type": "lecture", "label": null, "notes": null, "room_id": "1b250ffc-8b69-4f3a-ad2e-d9620731098d", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "26d85aa2-c25e-47dd-98d9-286bf1fc51a1", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "22d20cd0-26f9-49f9-836d-9a5b32a40e81", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('f9f7bcfd-5a59-459e-b8b6-6e5a4a344367', NULL, 'INSERT', 'timetable_entries', '3f4afc36-c3f2-4d9b-bdc9-9b80e7ed05e1', NULL, '{"id": "3f4afc36-c3f2-4d9b-bdc9-9b80e7ed05e1", "type": "break", "label": null, "notes": null, "room_id": null, "end_time": "12:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:15:00", "subject_id": null, "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": null, "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('f3ea5575-87fe-4d56-92b0-7dd39c959a5d', NULL, 'INSERT', 'timetable_entries', 'd7dec6f8-9973-417e-8d0d-c0d420938c4a', NULL, '{"id": "d7dec6f8-9973-417e-8d0d-c0d420938c4a", "type": "lecture", "label": null, "notes": null, "room_id": "1b250ffc-8b69-4f3a-ad2e-d9620731098d", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "26d85aa2-c25e-47dd-98d9-286bf1fc51a1", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 5, "professor_id": "4339dfe3-1f82-4ab4-b6e2-5a8d50919abb", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:14:05.169588+00'),
	('95755f98-4a94-4dad-90b6-448f991aa5f7', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'UPDATE', 'timetable_entries', '2eeffa7d-7213-440f-90be-1ea5b1c8b1db', '{"id": "2eeffa7d-7213-440f-90be-1ea5b1c8b1db", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "d9191848-3562-4b34-bcbe-3abdb9d6ce57", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '{"id": "2eeffa7d-7213-440f-90be-1ea5b1c8b1db", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:17:34.762813+00:00", "day_of_week": 1, "professor_id": "3c46c851-6ece-47b7-8fe2-f8d67ea9ee90", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:17:34.762813+00'),
	('0342b5bd-dded-43bb-bb0f-253f9f3829d9', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'UPDATE', 'timetable_entries', '2eeffa7d-7213-440f-90be-1ea5b1c8b1db', '{"id": "2eeffa7d-7213-440f-90be-1ea5b1c8b1db", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:17:34.762813+00:00", "day_of_week": 1, "professor_id": "3c46c851-6ece-47b7-8fe2-f8d67ea9ee90", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '{"id": "2eeffa7d-7213-440f-90be-1ea5b1c8b1db", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:17:39.510812+00:00", "day_of_week": 1, "professor_id": "c98e1ffe-bd27-4886-b63f-020d3c8ed0bd", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:17:39.510812+00'),
	('5ee2402d-fc94-44c6-8da9-70c8c3c9be68', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'UPDATE', 'timetable_entries', 'bfc32f2f-6344-4f2c-9cd3-1007c0da275b', '{"id": "bfc32f2f-6344-4f2c-9cd3-1007c0da275b", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "d9191848-3562-4b34-bcbe-3abdb9d6ce57", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '{"id": "bfc32f2f-6344-4f2c-9cd3-1007c0da275b", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:17:47.329102+00:00", "day_of_week": 1, "professor_id": "3c46c851-6ece-47b7-8fe2-f8d67ea9ee90", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:17:47.329102+00'),
	('bea1f092-8d5b-48e0-9243-aa3e22ca5be9', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'UPDATE', 'timetable_entries', 'bfc32f2f-6344-4f2c-9cd3-1007c0da275b', '{"id": "bfc32f2f-6344-4f2c-9cd3-1007c0da275b", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:17:47.329102+00:00", "day_of_week": 1, "professor_id": "3c46c851-6ece-47b7-8fe2-f8d67ea9ee90", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '{"id": "bfc32f2f-6344-4f2c-9cd3-1007c0da275b", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:17:51.292826+00:00", "day_of_week": 1, "professor_id": "c98e1ffe-bd27-4886-b63f-020d3c8ed0bd", "timetable_id": "044b8d06-9aef-4a4c-bb47-557e5b28f4e1"}', '2026-08-24 18:17:51.292826+00'),
	('f41518e1-0639-4c9c-9466-ddae7fbc4025', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'UPDATE', 'timetable_entries', '4538faef-da32-4cad-b407-e9df1e178193', '{"id": "4538faef-da32-4cad-b407-e9df1e178193", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '{"id": "4538faef-da32-4cad-b407-e9df1e178193", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "12:15:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "11:15:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:19:55.175653+00:00", "day_of_week": 1, "professor_id": "c98e1ffe-bd27-4886-b63f-020d3c8ed0bd", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:19:55.175653+00'),
	('42b414fc-5036-4f4b-ac4d-8fc55a16186f', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'UPDATE', 'timetable_entries', '29bf5e22-5155-4786-bac6-6fae97812d91', '{"id": "29bf5e22-5155-4786-bac6-6fae97812d91", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:14:05.169588+00:00", "day_of_week": 1, "professor_id": "28ed5e2c-3c78-4652-9e7d-4cebac2161a4", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '{"id": "29bf5e22-5155-4786-bac6-6fae97812d91", "type": "tutorial", "label": null, "notes": null, "room_id": "dcab1905-8e33-4247-8875-d7fa9a247abf", "end_time": "13:45:00", "created_at": "2026-08-24T18:14:05.169588+00:00", "start_time": "12:45:00", "subject_id": "b681e33e-eb4d-4e85-a875-28f1c0b3ad6f", "updated_at": "2026-08-24T18:20:01.319489+00:00", "day_of_week": 1, "professor_id": "c98e1ffe-bd27-4886-b63f-020d3c8ed0bd", "timetable_id": "33ff0513-2128-4395-a2e9-1fd1faac4425"}', '2026-08-24 18:20:01.319489+00'),
	('bf060534-571c-4aac-88cf-cd5d59a357ed', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'INSERT', 'announcements', '99c0aa0a-0479-4da2-80d7-a998fb9c3d0e', NULL, '{"id": "99c0aa0a-0479-4da2-80d7-a998fb9c3d0e", "title": "Test", "content": "Testing the new Feature", "class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7", "created_at": "2026-08-24T18:38:44.52021+00:00", "created_by": "eed80886-8b6a-4fb8-814e-28164d91e1da", "updated_at": "2026-08-24T18:38:44.52021+00:00"}', '2026-08-24 18:38:44.52021+00'),
	('f6314cf3-a219-4544-91bf-906371d5f4a9', 'eed80886-8b6a-4fb8-814e-28164d91e1da', 'DELETE', 'announcements', '99c0aa0a-0479-4da2-80d7-a998fb9c3d0e', '{"id": "99c0aa0a-0479-4da2-80d7-a998fb9c3d0e", "title": "Test", "content": "Testing the new Feature", "class_id": "a9be933d-faeb-4d6c-ae33-e2c4699691a7", "created_at": "2026-08-24T18:38:44.52021+00:00", "created_by": "eed80886-8b6a-4fb8-814e-28164d91e1da", "updated_at": "2026-08-24T18:38:44.52021+00:00"}', NULL, '2026-08-24 18:39:02.13897+00');


--
-- Data for Name: professors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."professors" ("id", "name", "email", "created_at", "updated_at", "short_name") VALUES
	('9cd05983-90d0-449d-817d-7b8f63d180af', 'Dr. Urvisha Tarpara', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'UVT'),
	('c273c3ff-0520-433d-a223-7a3aea8aadab', 'Prof. Manish C. Bhatt', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'MCB'),
	('ad76ac59-f903-4cb6-862c-e78cad14e841', 'Prof. Rashani Patel', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'RAP'),
	('28ed5e2c-3c78-4652-9e7d-4cebac2161a4', 'Prof. Bhavixa Bhagat', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'BPB'),
	('d2064693-96d5-4cb7-a021-85c2eaf2e447', 'Prof. Tejas Prajapati', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'TKP'),
	('d9191848-3562-4b34-bcbe-3abdb9d6ce57', 'Prof. Chintan Sojitra', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'CAS'),
	('f8ff121f-1e18-4d84-87a4-fe1f4f708be5', 'Prof. Urmila R. Shah', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'URS'),
	('4339dfe3-1f82-4ab4-b6e2-5a8d50919abb', 'Prof. Vipul Verma', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'VV'),
	('bef1b36c-7d16-4628-944b-259d70bebdbb', 'Prof. Snehal R. Chauhan', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'SRC'),
	('6eae96a7-dd53-4993-92b7-d2e92d505a11', 'Dr. Mudra H. Jadav', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'MJ'),
	('8f75da63-b377-4aac-964f-bc045ff19991', 'Prof. Hitenkumar L. Kheni', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'HLK'),
	('02794951-62fb-4a9e-b7fa-81ce277bb3e9', 'Prof. Hetalki Patel', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'HAP'),
	('920356bb-c406-441c-a565-c2fc01a9b2ae', 'Shreash Trivedi', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'ST'),
	('527a88a6-f482-45d0-b59d-c2756e413590', 'Prof. Bhaumik J. Patel', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'BJP'),
	('22d20cd0-26f9-49f9-836d-9a5b32a40e81', 'Dr. Digant A. Pastagia', NULL, '2026-08-24 16:53:44.995951+00', '2026-08-24 16:53:44.995951+00', 'DAP'),
	('c98e1ffe-bd27-4886-b63f-020d3c8ed0bd', '.', NULL, '2026-08-24 17:51:24.108918+00', '2026-08-24 17:51:24.108918+00', 'BPB,CAS,URS'),
	('3c46c851-6ece-47b7-8fe2-f8d67ea9ee90', '.', NULL, '2026-08-24 17:51:41.181078+00', '2026-08-24 17:51:41.181078+00', 'MAS'),
	('ddcd0756-e5fa-4a46-9497-804576393244', '.', NULL, '2026-08-24 17:52:02.209403+00', '2026-08-24 17:52:02.209403+00', 'JP'),
	('a7da8147-97ed-4d3f-babe-05afee1d4c2f', '.', NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'SSR');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "name", "description", "created_at") VALUES
	('85a5a79b-e417-47a6-9ccc-63feca715d3b', 'owner', 'Full system access, role management, and system configuration.', '2026-08-24 16:16:17.793884+00'),
	('071bfcef-d248-4a74-8052-c352e10a0dc1', 'admin', 'Timetable CRUD, management of subjects, rooms, classes, and users.', '2026-08-24 16:16:17.793884+00'),
	('be3500c8-0e1d-4b51-a9eb-1da52b4806ec', 'editor', 'Manage timetable entries and view schedule data.', '2026-08-24 16:16:17.793884+00'),
	('ec36e1b1-3fcb-480f-a014-aedc63247893', 'user', 'Standard user who can view schedules and manage personal preferences.', '2026-08-24 16:16:17.793884+00');


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."rooms" ("id", "name", "building", "created_at", "updated_at") VALUES
	('dcab1905-8e33-4247-8875-d7fa9a247abf', '309-A', '3rd Floor', '2026-08-24 16:35:03.888779+00', '2026-08-24 16:35:03.888779+00'),
	('c70c86b7-7d19-4f1e-ac96-d89fde7d606f', '007', 'Ground Floor', '2026-08-24 17:23:15.044801+00', '2026-08-24 17:23:15.044801+00'),
	('31b2f1a4-cb99-4774-bad0-2361168769c3', '116', '1st Floor', '2026-08-24 17:23:29.386468+00', '2026-08-24 17:23:29.386468+00'),
	('1b250ffc-8b69-4f3a-ad2e-d9620731098d', '010', 'Ground Floor', '2026-08-24 17:23:42.912353+00', '2026-08-24 17:23:42.912353+00'),
	('fba7f282-fc4d-4941-adab-00d66bd71183', '307', '3rd Floor', '2026-08-24 17:50:07.028973+00', '2026-08-24 17:50:07.028973+00'),
	('69de7f5a-ddc3-4131-a8e8-0ef78e850d7b', '203', '2nd Floor', '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00');


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subjects" ("id", "name", "short_name", "code", "created_at", "updated_at") VALUES
	('6e376d7c-9787-47f3-8cd1-5f0c02506622', 'Basic Mechanical Engineering', 'BME', 'BE01R00081', '2026-08-24 16:35:52.769562+00', '2026-08-24 16:35:52.769562+00'),
	('162273b8-2c51-47d8-b090-408e4c02cc23', 'Integrated Personality Development Course', 'IPDC', 'BE01R00161', '2026-08-24 16:36:16.28218+00', '2026-08-24 16:36:16.28218+00'),
	('05632734-a849-43c2-9c14-f7c868feea5d', 'Physics', 'PHY', 'BE01R00021', '2026-08-24 16:36:33.22499+00', '2026-08-24 16:36:33.22499+00'),
	('26d85aa2-c25e-47dd-98d9-286bf1fc51a1', 'Design Thinking', 'DT', 'BE01R00071', '2026-08-24 16:36:50.96554+00', '2026-08-24 16:36:50.96554+00'),
	('3ab6b924-83b5-41f1-84b8-7fa332541f6b', 'Digital Fabrication Workshop', 'W/S', 'BE01R00181', '2026-08-24 16:37:03.327641+00', '2026-08-24 16:37:03.327641+00'),
	('b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'Mathematics-1', 'M1', 'BE01R00041', '2026-08-24 16:37:35.213414+00', '2026-08-24 16:37:35.213414+00');


--
-- Data for Name: timetables; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."timetables" ("id", "class_id", "name", "effective_from", "effective_until", "is_active", "created_at", "updated_at") VALUES
	('f1bc66df-e36e-4ed6-9378-cdca743a40cc', 'a9be933d-faeb-4d6c-ae33-e2c4699691a7', 'COM13C', '2026-08-12', NULL, true, '2026-08-24 17:24:20.369419+00', '2026-08-24 17:24:20.369419+00'),
	('33ff0513-2128-4395-a2e9-1fd1faac4425', '335594e8-bcf1-49de-9448-df3e0be864d2', 'COM13A', '2026-08-12', NULL, true, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00'),
	('044b8d06-9aef-4a4c-bb47-557e5b28f4e1', '193102c0-a412-4eb0-b8e0-b25b0d0d2e9c', 'COM13B', '2026-08-12', NULL, true, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00');


--
-- Data for Name: timetable_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."timetable_entries" ("id", "timetable_id", "day_of_week", "start_time", "end_time", "subject_id", "room_id", "type", "label", "notes", "created_at", "updated_at", "professor_id") VALUES
	('0cf121f7-4382-4aea-a26a-477904e1e085', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 1, '09:15:00', '10:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:24:51.678067+00', '2026-08-24 17:24:51.678067+00', 'c273c3ff-0520-433d-a223-7a3aea8aadab'),
	('71ccd492-e60f-4d14-b79a-d52fd398604a', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 1, '10:15:00', '11:15:00', '162273b8-2c51-47d8-b090-408e4c02cc23', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:25:17.371155+00', '2026-08-24 17:25:17.371155+00', '920356bb-c406-441c-a565-c2fc01a9b2ae'),
	('2df7b0e4-345c-4aa8-8b44-c7fdd3c35cf7', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 1, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 17:26:52.951177+00', '2026-08-24 17:26:52.951177+00', NULL),
	('f8e7f927-eefe-4269-add0-1c91401fd196', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 1, '13:45:00', '15:45:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:28:39.151738+00', '2026-08-24 17:28:39.151738+00', '8f75da63-b377-4aac-964f-bc045ff19991'),
	('032ba7c4-e7aa-457e-b9f9-0ebf9ec7d212', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 2, '09:15:00', '10:15:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:29:27.68222+00', '2026-08-24 17:29:27.68222+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('e153731a-6b9f-42ac-ac5c-e30b33ef65b9', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 2, '11:15:00', '12:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'c70c86b7-7d19-4f1e-ac96-d89fde7d606f', 'lecture', NULL, NULL, '2026-08-24 17:30:48.821962+00', '2026-08-24 17:30:48.821962+00', '527a88a6-f482-45d0-b59d-c2756e413590'),
	('ed3511e2-3ba9-4273-931f-4dc6a1587d25', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 2, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 17:31:06.31451+00', '2026-08-24 17:31:06.31451+00', NULL),
	('5a5e2688-2269-440f-8466-903cdc78d799', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 2, '12:45:00', '13:45:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'c70c86b7-7d19-4f1e-ac96-d89fde7d606f', 'lecture', NULL, NULL, '2026-08-24 17:31:48.566045+00', '2026-08-24 17:31:48.566045+00', '527a88a6-f482-45d0-b59d-c2756e413590'),
	('4538faef-da32-4cad-b407-e9df1e178193', '33ff0513-2128-4395-a2e9-1fd1faac4425', 1, '11:15:00', '12:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'tutorial', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:19:55.175653+00', 'c98e1ffe-bd27-4886-b63f-020d3c8ed0bd'),
	('7d2af021-2986-4f67-8965-e9b176c308a6', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 3, '11:15:00', '12:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:33:17.823169+00', '2026-08-24 17:33:17.823169+00', '28ed5e2c-3c78-4652-9e7d-4cebac2161a4'),
	('f712a4d7-5490-4ea1-b552-fa9d3e7e0fec', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 3, '12:45:00', '13:45:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:34:25.376927+00', '2026-08-24 17:34:25.376927+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('8fcb61c8-e624-4796-bccb-7c5e6e6ef110', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 4, '11:15:00', '12:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:35:27.673911+00', '2026-08-24 17:35:27.673911+00', '527a88a6-f482-45d0-b59d-c2756e413590'),
	('4d2b0fb3-1c9b-469d-af05-1c170cd3b3a8', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 4, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 17:35:41.357561+00', '2026-08-24 17:35:49.612574+00', NULL),
	('6af7e617-9ca3-47b7-bf6c-9aec6dd1a8e6', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 4, '12:45:00', '14:45:00', '05632734-a849-43c2-9c14-f7c868feea5d', '31b2f1a4-cb99-4774-bad0-2361168769c3', 'lecture', NULL, NULL, '2026-08-24 17:36:27.184488+00', '2026-08-24 17:36:27.184488+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('6c093351-4d94-4179-8fbe-04a1c2eac9b3', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 5, '09:15:00', '10:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:36:57.143223+00', '2026-08-24 17:36:57.143223+00', '28ed5e2c-3c78-4652-9e7d-4cebac2161a4'),
	('2b46e262-e460-417d-8950-fe6f9729110b', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 5, '10:15:00', '11:15:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:37:15.706914+00', '2026-08-24 17:37:15.706914+00', '6eae96a7-dd53-4993-92b7-d2e92d505a11'),
	('c8738584-372c-49e5-9c2d-c56f7eaebf69', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 5, '11:15:00', '12:15:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '1b250ffc-8b69-4f3a-ad2e-d9620731098d', 'lecture', NULL, NULL, '2026-08-24 17:37:47.407331+00', '2026-08-24 17:37:47.407331+00', '8f75da63-b377-4aac-964f-bc045ff19991'),
	('16bbbfc4-3856-4c58-8372-9bbc55f3d112', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 5, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 17:38:04.937928+00', '2026-08-24 17:38:04.937928+00', NULL),
	('21f925bd-4eaa-4efd-b689-0f7592b4136f', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 5, '12:45:00', '13:45:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '1b250ffc-8b69-4f3a-ad2e-d9620731098d', 'lecture', NULL, NULL, '2026-08-24 17:38:33.82697+00', '2026-08-24 17:38:33.82697+00', '8f75da63-b377-4aac-964f-bc045ff19991'),
	('29bf5e22-5155-4786-bac6-6fae97812d91', '33ff0513-2128-4395-a2e9-1fd1faac4425', 1, '12:45:00', '13:45:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'tutorial', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:20:01.319489+00', 'c98e1ffe-bd27-4886-b63f-020d3c8ed0bd'),
	('a79ae0c1-1643-4c33-9787-9b3e07322572', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 3, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 17:33:31.579079+00', '2026-08-24 17:46:40.890551+00', NULL),
	('62a5a104-4c99-4b0d-93c1-16122a7f5ac9', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 3, '09:15:00', '11:15:00', '3ab6b924-83b5-41f1-84b8-7fa332541f6b', 'fba7f282-fc4d-4941-adab-00d66bd71183', 'lecture', NULL, NULL, '2026-08-24 17:32:38.17034+00', '2026-08-24 17:50:21.785141+00', 'd2064693-96d5-4cb7-a021-85c2eaf2e447'),
	('92b5fe54-ea7a-47d2-b79e-6f9ba086f6cf', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 1, '11:15:00', '12:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'tutorial', NULL, NULL, '2026-08-24 17:26:20.322323+00', '2026-08-24 17:52:31.059765+00', 'c98e1ffe-bd27-4886-b63f-020d3c8ed0bd'),
	('cda0fbbc-02f7-4af5-9556-cb899aa92b71', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 1, '12:45:00', '13:45:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'tutorial', NULL, NULL, '2026-08-24 17:27:43.276335+00', '2026-08-24 17:52:37.358468+00', 'c98e1ffe-bd27-4886-b63f-020d3c8ed0bd'),
	('650d45f3-42f6-424d-aa27-af29a4c94cf6', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 2, '10:15:00', '11:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:30:18.34026+00', '2026-08-24 17:52:54.817868+00', '3c46c851-6ece-47b7-8fe2-f8d67ea9ee90'),
	('e7dbf5ee-ef3e-4978-89b8-40c3a0138d3f', 'f1bc66df-e36e-4ed6-9378-cdca743a40cc', 4, '10:15:00', '11:15:00', '162273b8-2c51-47d8-b090-408e4c02cc23', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 17:35:02.980661+00', '2026-08-24 17:53:10.567384+00', 'ddcd0756-e5fa-4a46-9497-804576393244'),
	('bda1bb0f-4b91-40c9-a111-f6935847015c', '33ff0513-2128-4395-a2e9-1fd1faac4425', 1, '09:15:00', '10:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'c273c3ff-0520-433d-a223-7a3aea8aadab'),
	('a5f83428-390b-4c08-af23-4493b34568de', '33ff0513-2128-4395-a2e9-1fd1faac4425', 1, '10:15:00', '11:15:00', '162273b8-2c51-47d8-b090-408e4c02cc23', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '920356bb-c406-441c-a565-c2fc01a9b2ae'),
	('e47de464-9e36-4249-94c5-929be0e6113f', '33ff0513-2128-4395-a2e9-1fd1faac4425', 1, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('6d72220e-55df-4c59-a3a5-b9cfb4a7b94b', '33ff0513-2128-4395-a2e9-1fd1faac4425', 1, '13:45:00', '15:45:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'bef1b36c-7d16-4628-944b-259d70bebdbb'),
	('c4da3361-7524-441a-adb5-bb92ccec2584', '33ff0513-2128-4395-a2e9-1fd1faac4425', 2, '09:15:00', '10:15:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('cc105947-2619-4ca3-a3fb-cc65cc2d7fbb', '33ff0513-2128-4395-a2e9-1fd1faac4425', 2, '10:15:00', '11:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '3c46c851-6ece-47b7-8fe2-f8d67ea9ee90'),
	('322e77d4-6ff0-462b-8bde-025f091a47b5', '33ff0513-2128-4395-a2e9-1fd1faac4425', 2, '11:15:00', '12:15:00', '3ab6b924-83b5-41f1-84b8-7fa332541f6b', 'fba7f282-fc4d-4941-adab-00d66bd71183', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '02794951-62fb-4a9e-b7fa-81ce277bb3e9'),
	('293ae28d-958f-40f7-84fc-ae86bc7d9def', '33ff0513-2128-4395-a2e9-1fd1faac4425', 2, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('0a2a4604-ec95-472e-a0fc-4227acee118c', '33ff0513-2128-4395-a2e9-1fd1faac4425', 2, '12:45:00', '13:45:00', '3ab6b924-83b5-41f1-84b8-7fa332541f6b', 'fba7f282-fc4d-4941-adab-00d66bd71183', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '02794951-62fb-4a9e-b7fa-81ce277bb3e9'),
	('68e2939e-8879-4b12-92e1-6323db0c6182', '33ff0513-2128-4395-a2e9-1fd1faac4425', 3, '09:15:00', '11:15:00', '05632734-a849-43c2-9c14-f7c868feea5d', '31b2f1a4-cb99-4774-bad0-2361168769c3', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('09b894e6-eac6-4c5b-b4d2-7d8d590efbfd', '33ff0513-2128-4395-a2e9-1fd1faac4425', 3, '11:15:00', '12:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '28ed5e2c-3c78-4652-9e7d-4cebac2161a4'),
	('f95a84f9-567f-4a04-9ab5-4ed345ea5968', '33ff0513-2128-4395-a2e9-1fd1faac4425', 3, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('acad5500-e81b-4080-b3bb-4608159f5ebc', '33ff0513-2128-4395-a2e9-1fd1faac4425', 3, '12:45:00', '13:45:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('3340cb9b-ff2e-4f48-958b-20c046a1e96f', '33ff0513-2128-4395-a2e9-1fd1faac4425', 4, '10:15:00', '11:15:00', '162273b8-2c51-47d8-b090-408e4c02cc23', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'ddcd0756-e5fa-4a46-9497-804576393244'),
	('9bcdb2f9-d189-4b4d-956f-98e5a6177b48', '33ff0513-2128-4395-a2e9-1fd1faac4425', 4, '11:15:00', '12:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '527a88a6-f482-45d0-b59d-c2756e413590'),
	('b00bbbc2-c19e-41b7-97ef-409c47546698', '33ff0513-2128-4395-a2e9-1fd1faac4425', 4, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('be769e3c-4fb1-47e7-a9fd-8e0ac8c70e29', '33ff0513-2128-4395-a2e9-1fd1faac4425', 4, '12:45:00', '14:45:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'c70c86b7-7d19-4f1e-ac96-d89fde7d606f', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'c273c3ff-0520-433d-a223-7a3aea8aadab'),
	('febdf4bb-5deb-4eff-ad5a-bbcc7d48f155', '33ff0513-2128-4395-a2e9-1fd1faac4425', 5, '09:15:00', '10:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '28ed5e2c-3c78-4652-9e7d-4cebac2161a4'),
	('5873d391-15c2-428f-aaa0-f93185c15288', '33ff0513-2128-4395-a2e9-1fd1faac4425', 5, '10:15:00', '11:15:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '6eae96a7-dd53-4993-92b7-d2e92d505a11'),
	('268b7dfb-0c72-4902-9d22-a06c35189127', '33ff0513-2128-4395-a2e9-1fd1faac4425', 5, '11:15:00', '12:15:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '1b250ffc-8b69-4f3a-ad2e-d9620731098d', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '4339dfe3-1f82-4ab4-b6e2-5a8d50919abb'),
	('a248c3ef-23ca-48fe-96ef-20ee462e1bf6', '33ff0513-2128-4395-a2e9-1fd1faac4425', 5, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('f5ffab53-420f-4b55-8827-37fba812b8e1', '33ff0513-2128-4395-a2e9-1fd1faac4425', 5, '12:45:00', '13:45:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '1b250ffc-8b69-4f3a-ad2e-d9620731098d', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '22d20cd0-26f9-49f9-836d-9a5b32a40e81'),
	('490fd224-b7c2-4a89-a0ba-de80faae4d22', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 1, '09:15:00', '10:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'c273c3ff-0520-433d-a223-7a3aea8aadab'),
	('81fb164c-de51-4b6a-9ec4-b9c93b604411', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 1, '10:15:00', '11:15:00', '162273b8-2c51-47d8-b090-408e4c02cc23', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '920356bb-c406-441c-a565-c2fc01a9b2ae'),
	('f964f785-56b8-4a88-b07b-a79716db3489', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 1, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('28036961-6003-4b12-9399-53b3a49ee43a', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 1, '13:45:00', '15:45:00', '05632734-a849-43c2-9c14-f7c868feea5d', '31b2f1a4-cb99-4774-bad0-2361168769c3', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '6eae96a7-dd53-4993-92b7-d2e92d505a11'),
	('606c858d-dd9f-439a-8b62-ef692ce6cc24', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 2, '09:15:00', '10:15:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('b7f0a908-e55b-4c69-9e52-50281bf2a3c2', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 2, '10:15:00', '11:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '3c46c851-6ece-47b7-8fe2-f8d67ea9ee90'),
	('9a532691-3776-4898-9e3b-645f8bd59de9', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 2, '11:15:00', '12:15:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '69de7f5a-ddc3-4131-a8e8-0ef78e850d7b', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'bef1b36c-7d16-4628-944b-259d70bebdbb'),
	('eb04f614-a156-4159-a57d-d0e9ae1d8ab7', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 2, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('0df43edf-e92a-47f6-a365-29f92ec19ff6', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 2, '12:45:00', '13:45:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '69de7f5a-ddc3-4131-a8e8-0ef78e850d7b', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '4339dfe3-1f82-4ab4-b6e2-5a8d50919abb'),
	('9b06e787-db1e-4c31-a1d1-db084b5eb958', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 3, '09:15:00', '11:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'c70c86b7-7d19-4f1e-ac96-d89fde7d606f', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'c273c3ff-0520-433d-a223-7a3aea8aadab'),
	('054dde51-9541-4bac-8c78-b7f81a8cfd83', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 3, '11:15:00', '12:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '28ed5e2c-3c78-4652-9e7d-4cebac2161a4'),
	('732471a5-0e51-44f4-a25b-61a050a2bad7', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 3, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('9f239396-7edd-4137-86b3-a199a936bdd5', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 3, '12:45:00', '13:45:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '9cd05983-90d0-449d-817d-7b8f63d180af'),
	('db38f74d-ecc6-4aff-9af0-06bd2ce95431', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 4, '10:15:00', '11:15:00', '162273b8-2c51-47d8-b090-408e4c02cc23', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'ddcd0756-e5fa-4a46-9497-804576393244'),
	('2b255f37-23ab-44d9-81f9-194257a599a3', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 4, '11:15:00', '12:15:00', '6e376d7c-9787-47f3-8cd1-5f0c02506622', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '527a88a6-f482-45d0-b59d-c2756e413590'),
	('76da597f-e2e1-40e8-9d8c-f7c3bbcbebb9', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 4, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('19e4bf12-aa7b-4b18-a01d-5bb084487550', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 4, '12:45:00', '14:45:00', '3ab6b924-83b5-41f1-84b8-7fa332541f6b', 'fba7f282-fc4d-4941-adab-00d66bd71183', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', 'a7da8147-97ed-4d3f-babe-05afee1d4c2f'),
	('18d80145-2098-4fad-91dc-e6c6cb26039c', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 5, '09:15:00', '10:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '28ed5e2c-3c78-4652-9e7d-4cebac2161a4'),
	('df4d6152-c500-465d-9e62-a9b4d6057019', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 5, '10:15:00', '11:15:00', '05632734-a849-43c2-9c14-f7c868feea5d', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '6eae96a7-dd53-4993-92b7-d2e92d505a11'),
	('7a6a34f7-191c-4c10-b44d-d1a239ceb220', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 5, '11:15:00', '12:15:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '1b250ffc-8b69-4f3a-ad2e-d9620731098d', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '22d20cd0-26f9-49f9-836d-9a5b32a40e81'),
	('3f4afc36-c3f2-4d9b-bdc9-9b80e7ed05e1', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 5, '12:15:00', '12:45:00', NULL, NULL, 'break', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', NULL),
	('d7dec6f8-9973-417e-8d0d-c0d420938c4a', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 5, '12:45:00', '13:45:00', '26d85aa2-c25e-47dd-98d9-286bf1fc51a1', '1b250ffc-8b69-4f3a-ad2e-d9620731098d', 'lecture', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:14:05.169588+00', '4339dfe3-1f82-4ab4-b6e2-5a8d50919abb'),
	('2eeffa7d-7213-440f-90be-1ea5b1c8b1db', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 1, '11:15:00', '12:15:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'tutorial', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:17:39.510812+00', 'c98e1ffe-bd27-4886-b63f-020d3c8ed0bd'),
	('bfc32f2f-6344-4f2c-9cd3-1007c0da275b', '044b8d06-9aef-4a4c-bb47-557e5b28f4e1', 1, '12:45:00', '13:45:00', 'b681e33e-eb4d-4e85-a875-28f1c0b3ad6f', 'dcab1905-8e33-4247-8875-d7fa9a247abf', 'tutorial', NULL, NULL, '2026-08-24 18:14:05.169588+00', '2026-08-24 18:17:51.292826+00', 'c98e1ffe-bd27-4886-b63f-020d3c8ed0bd');


--
-- Data for Name: timetable_overrides; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("user_id", "role_id") VALUES
	('eed80886-8b6a-4fb8-814e-28164d91e1da', '85a5a79b-e417-47a6-9ccc-63feca715d3b');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--



--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- PostgreSQL database dump complete
--

RESET ALL;
