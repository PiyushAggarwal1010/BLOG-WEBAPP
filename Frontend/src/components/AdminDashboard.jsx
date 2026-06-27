import React, { useEffect, useState, useContext } from 'react';
import Header from './Header';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { useInView } from 'react-intersection-observer';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useUsers();

    const { ref, inView } = useInView();

    const users = data?.pages.flatMap(page => page.users) || [];

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const totalUsers = data?.pages[0]?.totalUsers || 0;

    return (
        <div className="bg-stone-50 dark:bg-stone-950 min-h-screen text-stone-800 dark:text-stone-200 transition-colors">
            <Header />

            <div className="max-w-6xl mx-auto p-6 md:p-8 mt-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-stone-900 dark:text-white">Admin Control Room</h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-2">Welcome back, {user?.username.toUpperCase()}.</p>
                </div>

                <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
                    <div className="p-6 border-b border-stone-200 dark:border-stone-800">
                        <h2 className="text-xl font-bold">Registered Users ({totalUsers})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse block md:table">
                            {/* Hide headers on mobile, show them on medium screens and up */}
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-stone-100 dark:bg-stone-800 text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                    <th className="p-4 font-semibold rounded-tl-lg">User</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold text-right rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="block md:table-row-group">
                                {users.map((u) => (
                                    <tr
                                        key={u._id}
                                        // Mobile: Margin bottom, bordered card. Desktop: Standard table row border.
                                        className="block md:table-row mb-4 md:mb-0 border border-stone-200 dark:border-stone-700 md:border-0 md:border-b md:border-stone-100 dark:md:border-stone-800 rounded-xl md:rounded-none bg-white dark:bg-stone-900 md:bg-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                                    >
                                        {/* User Field */}
                                        <td className="p-4 font-medium flex justify-between md:table-cell items-center border-b border-stone-100 dark:border-stone-800 md:border-0">
                                            {/* Mobile label - Hidden on desktop */}
                                            <span className="md:hidden text-xs font-bold uppercase tracking-wider text-stone-400">User</span>
                                            <span>{u.username}</span>
                                        </td>

                                        {/* Email Field */}
                                        <td className="p-4 text-stone-500 dark:text-stone-400 flex justify-between md:table-cell items-center border-b border-stone-100 dark:border-stone-800 md:border-0">
                                            <span className="md:hidden text-xs font-bold uppercase tracking-wider text-stone-400">Email</span>
                                            <span className="truncate max-w-50 md:max-w-none">{u.email}</span>
                                        </td>

                                        {/* Role Field */}
                                        <td className="p-4 flex justify-between md:table-cell items-center border-b border-stone-100 dark:border-stone-800 md:border-0">
                                            <span className="md:hidden text-xs font-bold uppercase tracking-wider text-stone-400">Role</span>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${u.role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>

                                        {/* Actions Field */}
                                        <td className="p-4 flex justify-between md:table-cell items-center md:text-right">
                                            <span className="md:hidden text-xs font-bold uppercase tracking-wider text-stone-400">Actions</span>
                                            <button
                                                className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 text-sm font-medium transition-colors disabled:opacity-50"
                                                disabled={u.role === 'admin'}
                                            >
                                                Ban User
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!isLoading && hasNextPage && (
                            <div ref={ref} className="w-full flex justify-center items-center py-12">
                                {isFetchingNextPage ? (
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 dark:border-stone-700 border-t-stone-900 dark:border-t-white" />
                                ) : (
                                    <p className="text-stone-400 dark:text-stone-500 text-sm font-medium">Scroll down for more</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;