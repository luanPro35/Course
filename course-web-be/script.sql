create table auths
(
    id            bigint auto_increment
        primary key,
    email         varchar(255) not null,
    password_hash varchar(255) null,
    phone         varchar(255) null,
    constraint UKn40jka80fcix1bbq0mhf2b65l
        unique (email)
);

create table categories
(
    id   bigint auto_increment
        primary key,
    slug enum ('cpp', 'devops', 'javascript', 'python', 'react_native') not null,
    constraint UKoul14ho7bctbefv8jywp5v3i2
        unique (slug)
);

create table permissions
(
    name        varchar(255) not null
        primary key,
    description varchar(255) null
);

create table profiles
(
    id               bigint       not null
        primary key,
    about            longtext     null,
    avatar           varchar(255) null,
    create_time      datetime(6)  null,
    facebook         varchar(255) null,
    full_name        varchar(255) null,
    github           varchar(255) null,
    linkedin         varchar(255) null,
    personal_website varchar(255) null,
    update_time      datetime(6)  null,
    youtube          varchar(255) null,
    constraint FK8jx7ufu1ee0qsjf3dutsqem9m
        foreign key (id) references auths (id)
);

create table courses
(
    id                  bigint auto_increment
        primary key,
    badge               varchar(255)                null,
    created_at          datetime(6)                 null,
    description         longtext                    null,
    learning_outcomes   text                        null,
    price               decimal(38, 2)              null,
    stats               text                        null,
    status              enum ('DRAFT', 'PUBLISHED') null,
    subtitle            varchar(255)                null,
    subtitle_highlights text                        null,
    thumbnail_url       longtext                    null,
    title               varchar(255)                null,
    title_highlight     varchar(255)                null,
    updated_at          datetime(6)                 null,
    creator_id          bigint                      null,
    constraint FKs6dvme7i83j3d24epmgidkhus
        foreign key (creator_id) references profiles (id)
);

create table enrollments
(
    id              bigint auto_increment
        primary key,
    enrollment_date datetime(6) null,
    course_id       bigint      not null,
    profile_id      bigint      not null,
    enrolled_at     datetime(6) null,
    constraint FK7slnn4uji8olb0whkgurduwua
        foreign key (profile_id) references profiles (id),
    constraint FKho8mcicp4196ebpltdn9wl6co
        foreign key (course_id) references courses (id)
);

create table orders
(
    id               bigint auto_increment
        primary key,
    amount           decimal(38, 2)                                            not null,
    created_at       datetime(6)                                               null,
    gateway_trans_id varchar(255)                                              null,
    order_ref        varchar(255)                                              not null,
    pay_date         varchar(255)                                              null,
    payment_gateway  varchar(255)                                              not null,
    status           enum ('FAILED', 'FULFILLED', 'PAID', 'PENDING', 'REFUND') not null,
    updated_at       datetime(6)                                               null,
    course_id        bigint                                                    not null,
    profile_id       bigint                                                    not null,
    constraint UKiwspr2ybqjm9jxjy4iql7t4tc
        unique (order_ref),
    constraint FK68snkj0g5gsjxllhjc3v5lm0r
        foreign key (course_id) references courses (id),
    constraint FKeieprmmaadhys18lur996ikv4
        foreign key (profile_id) references profiles (id)
);

create table posts
(
    id            bigint auto_increment
        primary key,
    author        varchar(255)                null,
    content       longtext                    null,
    created_at    datetime(6)                 null,
    full_content  longtext                    null,
    status        enum ('DRAFT', 'PUBLISHED') null,
    thumbnail_url varchar(255)                null,
    title         varchar(255)                null,
    updated_at    datetime(6)                 null,
    category_id   bigint                      not null,
    profile_id    bigint                      not null,
    constraint FKijnwr3brs8vaosl80jg9rp7uc
        foreign key (category_id) references categories (id),
    constraint FKpsftfs7gvqj01ktpk1njeet96
        foreign key (profile_id) references profiles (id)
);

create table refresh_tokens
(
    id          bigint auto_increment
        primary key,
    expiry_time datetime(6)   not null,
    issue_time  datetime(6)   not null,
    revoked     bit           not null,
    token       varchar(1000) not null,
    auth_id     bigint        not null,
    constraint FKru90d040ntav8k959iihn89r5
        foreign key (auth_id) references auths (id)
);

create table roles
(
    name        varchar(255) not null
        primary key,
    description varchar(255) null
);

create table auth_roles
(
    auth_id bigint       not null,
    role_id varchar(255) not null,
    primary key (auth_id, role_id),
    constraint FKm3wuv6ggie22b0cqisspveuln
        foreign key (auth_id) references auths (id),
    constraint FKqgv2mfp56k21h59biy6i2qx3p
        foreign key (role_id) references roles (name)
);

create table roles_permissions
(
    role_name        varchar(255) not null,
    permissions_name varchar(255) not null,
    primary key (role_name, permissions_name),
    constraint FK6nw4jrj1tuu04j9rk7xwfssd6
        foreign key (role_name) references roles (name),
    constraint FK9u1xpvjxbdnkca024o6fyr7uu
        foreign key (permissions_name) references permissions (name)
);

create table sections
(
    id          bigint auto_increment
        primary key,
    order_index int default 0 not null,
    title       varchar(255)  null,
    course_id   bigint        not null,
    constraint FK7ty9cevpq04d90ohtso1q8312
        foreign key (course_id) references courses (id)
);

create table lessons
(
    id                  bigint auto_increment
        primary key,
    content_url         varchar(255)  null,
    duration_in_minutes int default 0 not null,
    order_index         int default 0 not null,
    title               varchar(255)  null,
    section_id          bigint        not null,
    constraint FKgt4502q9pklwr02uqh3qnrppi
        foreign key (section_id) references sections (id)
);


