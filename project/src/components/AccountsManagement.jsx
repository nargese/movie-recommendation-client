import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";

export default function AccountsManagement() {
    
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.roleName !== "admin") {
      navigate("/signIn");
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await fetch("https://localhost:7174/api/Comptes/GetCompte", {
          headers: {
            Accept: "text/plain",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const data = await response.json();
        setAccounts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [navigate, user]);

  const handleToggleAccess = async (accountId) => {
    try {
      const response = await fetch(
        `https://localhost:7174/api/Comptes/DeleteUser?id=${accountId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "text/plain",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle account access");
      }
      const updatedAccount = await response.json();
      setAccounts((prev) =>
        prev.map((account) =>
          account.idCompte === accountId
            ? { ...account, access: updatedAccount.access }
            : account
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Accounts Management
        </h2>
        <div className="bg-[#232323] p-6 rounded-lg shadow-lg">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">CIN</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Access</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.idCompte} className="border-b border-gray-700">
                  <td className="py-3 px-4">{account.nom}</td>
                  <td className="py-3 px-4">{account.email}</td>
                  <td className="py-3 px-4">{account.cin}</td>
                  <td className="py-3 px-4">{account.roleName}</td>
                  <td className="py-3 px-4">
                    {account.access ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Disabled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link
                      to={`/update-profile/${account.idCompte}`}
                      className="bg-[#e50914] hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleToggleAccess(account.idCompte)}
                      className={`${
                        account.access
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white py-2 px-4 rounded-lg`}
                    >
                      {account.access ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/"
          className="block text-center mt-4 text-gray-400 hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}