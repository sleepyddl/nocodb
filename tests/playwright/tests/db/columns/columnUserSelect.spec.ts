import { test } from '@playwright/test';
import { DashboardPage } from '../../../pages/Dashboard';
import { GridPage } from '../../../pages/Dashboard/Grid';
import setup, { unsetup } from '../../../setup';
import { TopbarPage } from '../../../pages/Dashboard/common/Topbar';

test.describe('User single select', () => {
  let dashboard: DashboardPage, grid: GridPage, topbar: TopbarPage;
  let context: any;

  test.beforeEach(async ({ page }) => {
    context = await setup({ page, isEmptyProject: false });
    dashboard = new DashboardPage(page, context.base);
    grid = dashboard.grid;
    topbar = dashboard.grid.topbar;

    await dashboard.treeView.createTable({ title: 'sheet1', baseTitle: context.base.title });

    await grid.column.create({ title: 'User', type: 'User' });

    await grid.addNewRow({ index: 0, value: 'Row 0' });
  });

  test.afterEach(async () => {
    await unsetup(context);
  });

  test('Verify the default option count, select default value and verify', async () => {
    await dashboard.grid.column.userOption.verifyDefaultValueOptionCount({ columnTitle: 'User', totalCount: 1 });

    await dashboard.grid.column.userOption.selectDefaultValueOption({
      columnTitle: 'User',
      option: 'user-0@nocodb.com',
      multiSelect: false,
    });

    // Verify default value
    await dashboard.grid.column.userOption.verifySelectedOptions({
      columnHeader: 'User',
      options: ['user-0@nocodb.com'],
    });
  });

  test('Rename column title and delete the column', async () => {
    // Rename column title, refresh and verify
    await dashboard.grid.column.openEdit({ title: 'User' });
    await dashboard.grid.column.fillTitle({ title: 'UserField' });
    await dashboard.grid.column.save({
      isUpdated: true,
    });
    await topbar.clickRefresh();
    await grid.column.verify({ title: 'UserField', isVisible: true });

    // delete column and verify
    await grid.column.delete({ title: 'UserField' });
    await grid.column.verify({ title: 'UserField', isVisible: false });
  });
});
