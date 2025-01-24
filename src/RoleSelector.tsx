import { Link } from 'react-router-dom';
import { UserCircle, Users, Building2 } from 'lucide-react';

const RoleSelector = () => {
  const roles = [
    {
      title: '管理者',
      description: 'キャリアアドバイザーの管理、KPI・実績管理、クレーム対応など',
      icon: Building2,
      path: '/admin/users',
      color: 'bg-[#2B579A]'
    },
    {
      title: 'キャリアアドバイザー',
      description: '日程管理、クライアント管理、メッセージ管理など',
      icon: Users,
      path: '/advisor/dashboard',
      color: 'bg-[#2B579A]'
    },
    {
      title: 'クライアント',
      description: '面談予約、履歴書添削依頼、メッセージ確認など',
      icon: UserCircle,
      path: '/user/auth',
      color: 'bg-[#2B579A]'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#2B579A]">
            HR team
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            デモ画面を閲覧する権限を選択してください
          </p>
        </div>

        {/* カード一覧 */}
        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.path}
              to={role.path}
              className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* カードの上部装飾 */}
              <div className={`${role.color} h-2 w-full`} />
              
              <div className="p-6">
                {/* アイコンと役割名 */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`${role.color} p-3 rounded-lg`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {role.title}
                  </h2>
                </div>

                {/* 説明文 */}
                <p className="text-gray-600 text-sm mb-6">
                  {role.description}
                </p>

                {/* 遷移ボタン */}
                <div className="flex items-center text-[#2B579A] group-hover:text-[#1a4277] transition-colors">
                  <span className="text-sm font-medium">画面を開く</span>
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* フッター */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>© 2024 HR team. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;