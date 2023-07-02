-- 注意：该页面对应的前台目录为views/erp文件夹下
-- 如果你想更改到其他目录，请修改sql中component字段对应的值


INSERT INTO sys_permission(id, parent_id, name, url, component, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_route, is_leaf, keep_alive, hidden, hide_tab, description, status, del_flag, rule_flag, create_by, create_time, update_by, update_time, internal_or_external) 
VALUES ('2023041501025910400', NULL, '方案笔记', '/erp/diySolutionNoteList', 'erp/DiySolutionNoteList', NULL, NULL, 0, NULL, '1', 0.00, 0, NULL, 1, 0, 0, 0, 0, NULL, '1', 0, 0, 'admin', '2023-04-15 13:02:40', NULL, NULL, 0);

-- 权限控制sql
-- 新增
INSERT INTO sys_permission(id, parent_id, name, url, component, is_route, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_leaf, keep_alive, hidden, hide_tab, description, create_by, create_time, update_by, update_time, del_flag, rule_flag, status, internal_or_external)
VALUES ('2023041501025920401', '2023041501025910400', '添加方案笔记', NULL, NULL, 0, NULL, NULL, 2, 'erp:diy_solution_note:add', '1', NULL, 0, NULL, 1, 0, 0, 0, NULL, 'admin', '2023-04-15 13:02:40', NULL, NULL, 0, 0, '1', 0);
-- 编辑
INSERT INTO sys_permission(id, parent_id, name, url, component, is_route, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_leaf, keep_alive, hidden, hide_tab, description, create_by, create_time, update_by, update_time, del_flag, rule_flag, status, internal_or_external)
VALUES ('2023041501025920402', '2023041501025910400', '编辑方案笔记', NULL, NULL, 0, NULL, NULL, 2, 'erp:diy_solution_note:edit', '1', NULL, 0, NULL, 1, 0, 0, 0, NULL, 'admin', '2023-04-15 13:02:40', NULL, NULL, 0, 0, '1', 0);
-- 删除
INSERT INTO sys_permission(id, parent_id, name, url, component, is_route, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_leaf, keep_alive, hidden, hide_tab, description, create_by, create_time, update_by, update_time, del_flag, rule_flag, status, internal_or_external)
VALUES ('2023041501025920403', '2023041501025910400', '删除方案笔记', NULL, NULL, 0, NULL, NULL, 2, 'erp:diy_solution_note:delete', '1', NULL, 0, NULL, 1, 0, 0, 0, NULL, 'admin', '2023-04-15 13:02:40', NULL, NULL, 0, 0, '1', 0);
-- 批量删除
INSERT INTO sys_permission(id, parent_id, name, url, component, is_route, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_leaf, keep_alive, hidden, hide_tab, description, create_by, create_time, update_by, update_time, del_flag, rule_flag, status, internal_or_external)
VALUES ('2023041501025920404', '2023041501025910400', '批量删除方案笔记', NULL, NULL, 0, NULL, NULL, 2, 'erp:diy_solution_note:deleteBatch', '1', NULL, 0, NULL, 1, 0, 0, 0, NULL, 'admin', '2023-04-15 13:02:40', NULL, NULL, 0, 0, '1', 0);
-- 导出excel
INSERT INTO sys_permission(id, parent_id, name, url, component, is_route, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_leaf, keep_alive, hidden, hide_tab, description, create_by, create_time, update_by, update_time, del_flag, rule_flag, status, internal_or_external)
VALUES ('2023041501025920405', '2023041501025910400', '导出excel_方案笔记', NULL, NULL, 0, NULL, NULL, 2, 'erp:diy_solution_note:exportXls', '1', NULL, 0, NULL, 1, 0, 0, 0, NULL, 'admin', '2023-04-15 13:02:40', NULL, NULL, 0, 0, '1', 0);
-- 导入excel
INSERT INTO sys_permission(id, parent_id, name, url, component, is_route, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_leaf, keep_alive, hidden, hide_tab, description, create_by, create_time, update_by, update_time, del_flag, rule_flag, status, internal_or_external)
VALUES ('2023041501026020406', '2023041501025910400', '导入excel_方案笔记', NULL, NULL, 0, NULL, NULL, 2, 'erp:diy_solution_note:importExcel', '1', NULL, 0, NULL, 1, 0, 0, 0, NULL, 'admin', '2023-04-15 13:02:40', NULL, NULL, 0, 0, '1', 0);