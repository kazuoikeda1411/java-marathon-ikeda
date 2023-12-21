describe('顧客情報入力フォームのテスト', () => {
  it('確認画面で登録処理が正常に処理されるか確認する', () => {
    // テストデータの読み込み
    let formCompanyName;
    let formIndustry;
    let formContact;
    let formLocation;
    cy.fixture('customerData').then((data) => {
      // フォームの入力フィールドにテストデータを入力
      const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      formCompanyName = encodeURIComponent(data.companyName);
      formIndustry = encodeURIComponent(data.industry);
      formContact = encodeURIComponent(uniqueContactNumber);
      formLocation = encodeURIComponent(data.location);
      cy.visit(`/kazuo_ikeda/customer/add-confirm.html?companyName=${formCompanyName}&industry=${formIndustry}&contact=${formContact}&location=${formLocation}`);
    });
    cy.window().then((win) => {
      // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, 'alert').as('alertStub');
    });
    //確認画面の送信ボタンを押下する
    cy.get('#confirmButton').click();
    cy.get('@alertStub').should('have.been.calledOnceWith', '顧客情報が正常に保存されました。');
  });

  it("顧客リストのCompany Nameを押下したとき適切に詳細画面に遷移する", () => {
    cy.visit("/kazuo_ikeda/customer/list.html");//テスト対象ページにアクセス
    cy.wait(1000);
    cy.get('a[href*="hoge"]').click();
    cy.wait(1000);
    cy.url().should('include', '/customer/detail.html?companyName=hoge');
  })

  it("編集画面に遷移したとき事前に文字が入っているか確認する", () => {
    cy.visit("/kazuo_ikeda/customer/update.html?customerId=1");//テスト対象ページにアクセス
    cy.wait(1000);
    //入力値の確認
    cy.get("#industry").should("have.value", "hoge");
    cy.get("#companyName").should("have.value", "hoge");
    cy.get("#contact").should("have.value", "hoge");
    cy.get("#location").should("have.value", "hoge");
    //top画面に戻る
    cy.contains('トップ画面に戻る').click();
    cy.wait(1000);
    cy.url().should('include', '/');
  })
});